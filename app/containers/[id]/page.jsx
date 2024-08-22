"use client";
import { useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import useSWR, { mutate } from "swr";
import {
  Checkbox,
  CheckboxGroup,
  CircularProgress,
  useDisclosure,
} from "@nextui-org/react";
import { deleteContainer } from "../api/db";
import toast from "react-hot-toast";
import EditContainer from "../EditContainer";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import ItemCard from "@/app/components/ItemCard";
import ItemGrid from "@/app/components/ItemGrid";
import ContainerCard from "@/app/components/ContainerCard";
import { sortObjectArray } from "@/app/lib/helpers";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const [showItemModal, setShowItemModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [selected, setSelected] = useState(["containers", "items"]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data, error, isLoading } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  const { user } = useUser();

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <CircularProgress aria-label="Loading" />;

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
      !confirm(
        `Are you sure you want to delete ${data?.name || "this container"}?`
      )
    )
      return;
    try {
      await mutate("containers", deleteContainer({ id }), {
        optimisticData: user?.containers?.filter(
          (container) => container.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Deleted");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  let filteredResults = [];

  if (selected.length === 2)
    filteredResults = data?.items?.concat(data?.containers);

  if (selected.length === 1 && selected.includes("containers")) {
    filteredResults = data?.containers;
  } else if (selected.length === 1 && selected.includes("items")) {
    filteredResults = data?.items;
  }

  return (
    <>
      <h1 className="font-bold text-3xl pb-1 pt-2">{data?.name}</h1>

      <p className="mb-3 font-medium text-lg">
        Current location: {data.location?.name}
      </p>
      <p className="mb-3 font-medium text-lg">
        Parent: {data.parentContainer?.name}
      </p>
      <p className="mb-3 font-medium text-lg">Level: {data.level}</p>
      <CheckboxGroup
        orientation="horizontal"
        value={selected}
        onValueChange={setSelected}
        classNames={{
          base: "mt-6 mb-[-10px]",
          wrapper: "gap-3",
        }}
      >
        <label className="font-medium">Show:</label>
        <Checkbox value="containers">Inner containers</Checkbox>
        <Checkbox value="items">Items</Checkbox>
      </CheckboxGroup>

      <ItemGrid classNames="my-8" gap="6">
        {sortObjectArray(filteredResults)?.map((cardItem) => {
          return cardItem.hasOwnProperty("parentContainerId") ? (
            <ContainerCard key={cardItem.name} container={cardItem} />
          ) : (
            <ItemCard key={cardItem.name} item={cardItem} />
          );
        })}
      </ItemGrid>
      <EditContainer
        data={data}
        id={id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />

      <ContextMenu
        type="container"
        onDelete={handleDelete}
        onEdit={onOpen}
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        type="container"
        name={data.name}
        itemList={data?.items}
        isRemove={isRemove}
      />
    </>
  );
};

export default Page;
