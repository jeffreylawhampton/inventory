"use client";
import { useContext } from "react";
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
import { AccordionContext, FilterContext, ModalContext } from "../providers";
import { handleDeleteMany } from "./handlers";
import { fetcher } from "../lib/helpers";

export default function Page() {
  const { data, error, isLoading } = useSWR("/categories/api", fetcher);
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);
  const {
    setCurrentModal,
    close,
    open,
    handleCancel,
    showDelete,
    setShowDelete,
  } = useContext(ModalContext);
  const { setFilter } = useContext(FilterContext);

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
      <div className="pt-2 pb-32">
        <h1 className="font-bold text-4xl pt-10 pb-4">Categories</h1>

        <SearchFilter
          label={"Filter by category name"}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="flex items-center gap-1 mb-5 mt-1">
          <CardToggle />
          <FavoriteFilterButton label="Favorites" />
        </div>
        <AllCategories data={data} />

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
                selectedObjects,
                setSelectedObjects,
                mutateKey: "/categories/api",
              })
            }
            type="categories"
            count={selectedObjects?.length}
          />
        ) : null}
      </div>
    </>
  );
}
