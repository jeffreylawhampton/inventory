"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import {
  CardToggle,
  ContextMenu,
  DeleteButtons,
  FavoriteFilterButton,
  Header,
  Loading,
  NewCategory,
  SearchFilter,
} from "@/app/components";
import AllCategories from "./AllCategories";
import { DeviceContext } from "../providers";
import { handleDeleteMany } from "./handlers";
import { fetcher } from "../lib/helpers";

export default function Page() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const { data, error, isLoading } = useSWR("/categories/api", fetcher);
  const { setCurrentModal, close, open } = useContext(DeviceContext);

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
        <NewCategory data={data} mutateKey="/categories/api" close={close} />
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
      <div className="pt-2 pb-32 lg:pb-8">
        <h1 className="font-bold text-4xl pt-10 pb-4">Categories</h1>

        <SearchFilter
          label={"Filter by category name"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
        <div className="flex items-center gap-1 mb-5 mt-1">
          <CardToggle />
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
                mutateKey: "/categories/api",
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
