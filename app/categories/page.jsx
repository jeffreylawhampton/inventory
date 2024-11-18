"use client";
import { useState, useEffect } from "react";
import NewCategory from "./NewCategory";
import useSWR from "swr";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import Loading from "../components/Loading";
import SearchFilter from "../components/SearchFilter";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import FavoriteFilterButton from "../components/FavoriteFilterButton";
import AllCategories from "./AllCategories";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const [categoryList, setCategoryList] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("categories", fetcher);

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

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div className="pb-8 xl:pt-8">
      <h1 className="font-bold text-3xl pb-5">Categories</h1>

      <SearchFilter
        label={"Search for a container"}
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
      />
      <NewCategory
        categoryList={categoryList}
        opened={opened}
        close={close}
        open={open}
      />
      <CreateButton tooltipText={"Add new category"} onClick={open} />
    </div>
  );
}
