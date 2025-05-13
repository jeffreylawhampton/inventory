"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import {
  ContextMenu,
  FavoriteFilterButton,
  Loading,
  SearchFilter,
  DeleteButtons,
} from "@/app/components";
import NewCategory from "./NewCategory";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import AllCategories from "./AllCategories";
import { DeviceContext } from "../layout";
import { deleteMany } from "./api/db";
import Header from "../components/Header";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [opened, { open, close }] = useDisclosure();
  const [categoryList, setCategoryList] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("categories", fetcher);
  const { setCrumbs } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(null);
  }, []);

  useEffect(() => {
    data && setCategoryList([...data]);
  }, [data]);

  const filtered = showFavorites
    ? categoryList?.filter((cat) => cat.favorite)
    : categoryList;

  const handleCategoryFavoriteClick = async (category) => {
    const add = !category.favorite;
    const categoryArray = [...data];
    const categoryToUpdate = categoryArray.find(
      (i) => i.name === category.name
    );
    categoryToUpdate.favorite = !category.favorite;

    try {
      if (
        await mutate(
          toggleFavorite({ type: "category", id: category.id, add }),
          {
            optimisticData: categoryArray,
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        )
      ) {
        toast.success(
          add
            ? `Added ${category.name} to favorites`
            : `Removed ${category.name} from favorites`
        );
      }
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleCancel = () => {
    setSelectedCategories([]);
    setShowDelete(false);
  };

  const handleDelete = async () => {
    try {
      await mutate(deleteMany(selectedCategories));
      setShowDelete(false);
      toast.success(
        `Deleted ${selectedCategories?.length} ${
          selectedCategories?.length === 1 ? "category" : "categories"
        }`
      );
      setSelectedCategories([]);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <>
      <Header />

      <div className="pb-8 mt-[-1.7rem]">
        <h1 className="font-bold text-4xl pb-6">Categories</h1>

        <SearchFilter
          label={"Filter by category name"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
        <div className="mb-5 mt-1">
          <FavoriteFilterButton
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            label="Favorites"
          />
        </div>
        <AllCategories
          categoryList={filtered}
          handleFavoriteClick={handleCategoryFavoriteClick}
          filter={filter}
          showDelete={showDelete}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <NewCategory
          categoryList={categoryList}
          opened={opened}
          close={close}
          open={open}
        />
        <ContextMenu
          onDelete={() => setShowDelete(true)}
          onCreateCategory={open}
          type="categories"
        />

        {showDelete ? (
          <DeleteButtons
            handleCancel={handleCancel}
            handleDelete={handleDelete}
            type="categories"
            count={selectedCategories?.length}
          />
        ) : null}
      </div>
    </>
  );
}
