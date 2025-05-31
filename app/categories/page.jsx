"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import {
  ContextMenu,
  FavoriteFilterButton,
  Loading,
  SearchFilter,
  DeleteButtons,
} from "@/app/components";
import AllCategories from "./AllCategories";
import { DeviceContext } from "../layout";
import Header from "../components/Header";
import { handleDeleteMany } from "./handlers";
import NewCategory from "../components/forms/NewCategory";

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
  const [categoryList, setCategoryList] = useState([]);
  const { data, error, isLoading } = useSWR("categories", fetcher);
  const { setCrumbs, setCurrentModal, close, open } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    data && setCategoryList([...data]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const filtered = showFavorites
    ? categoryList?.filter((cat) => cat.favorite)
    : categoryList;

  const handleCancel = () => {
    setSelectedCategories([]);
    setShowDelete(false);
  };

  const onCreateCategory = () => {
    setCurrentModal({
      component: (
        <NewCategory data={data} mutateKey="categories" close={close} />
      ),
      title: "Create new category",
      size: "lg",
    });
    open();
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
          data={data}
          filter={filter}
          showDelete={showDelete}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        <ContextMenu
          onDelete={() => setShowDelete(true)}
          onCreateCategory={onCreateCategory}
          type="categories"
        />

        {showDelete ? (
          <DeleteButtons
            handleCancelItems={handleCancel}
            handleDeleteItems={() =>
              handleDeleteMany({
                data,
                setShowDelete,
                selectedCategories,
                setSelectedCategories,
              })
            }
            type="categories"
            count={selectedCategories?.length}
          />
        ) : null}
      </div>
    </>
  );
}
