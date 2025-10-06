"use client";
import { useContext } from "react";
import useSWR from "swr";
import {
  ContextMenu,
  DeleteButtons,
  Header,
  Loading,
  NewCategory,
  SortAndFilter,
} from "@/app/components";
import AllCategories from "./AllCategories";
import { AccordionContext, ModalContext } from "../providers";
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
      <div className="pt-2 pb-48 lg:pb-32">
        <div className="px-1.5 lg:px-3">
          <h1 className="font-bold text-4xl pt-10 pb-4">Categories</h1>
          <SortAndFilter data={data} type="category" showItemSort={false} />
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
