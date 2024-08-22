"use client";
import { CircularProgress, useDisclosure } from "@nextui-org/react";
import { deleteCategory } from "../api/db";
import toast from "react-hot-toast";
import EditCategory from "../EditCategory";
import { useUser } from "@/app/hooks/useUser";
import useSWR, { mutate } from "swr";
import ItemCard from "@/app/components/ItemCard";
import SearchFilter from "@/app/components/SearchFilter";
import { useState } from "react";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import { sortObjectArray } from "@/app/lib/helpers";

const fetcher = async (id) => {
  const res = await fetch(`/categories/api/${id}`);
  const data = await res.json();
  return data.category;
};

const Page = ({ params: { id } }) => {
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, isLoading, error } = useSWR(`categories${id}`, () =>
    fetcher(id)
  );

  const { user } = useUser();

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return <div>failed to load</div>;

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${data?.name || "this item"}`)
    )
      return;
    try {
      await mutate("categories", deleteCategory({ id }), {
        optimisticData: user?.categories?.filter(
          (category) => category.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(`Successfully deleted ${data?.name}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-3 items-center pb-4">
        <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
      </div>

      <SearchFilter
        label="Search for an item"
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 grow">
        {sortObjectArray(filteredResults).map((item) => {
          return <ItemCard key={item.name} item={item} />;
        })}
      </div>
      <EditCategory
        data={data}
        id={id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onOpen={onOpen}
      />

      <ContextMenu
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
        type="category"
        onDelete={handleDelete}
        onEdit={onOpen}
      />

      {showItemModal ? (
        <AddRemoveModal
          isRemove={isRemove}
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
          itemList={data?.items}
          type="category"
          name={data.name}
        />
      ) : null}
    </>
  );
};

export default Page;
