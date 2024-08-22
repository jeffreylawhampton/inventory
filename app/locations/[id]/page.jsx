"use client";
import { useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  CircularProgress,
  useDisclosure,
} from "@nextui-org/react";
import { deleteLocation } from "../api/db";
import toast from "react-hot-toast";
import EditLocation from "../EditLocation";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import ItemCard from "@/app/components/ItemCard";
import ContainerCard from "@/app/components/ContainerCard";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";

const fetcher = async (id) => {
  const res = await fetch(`/locations/api/${id}`);
  const data = await res.json();
  return data.location;
};

const Page = ({ params: { id } }) => {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(["containers", "items"]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUser();
  const { data, error, isLoading } = useSWR(`location${id}`, () => fetcher(id));

  if (error) return "Failed to fetch";
  if (isLoading) return <CircularProgress aria-label="Loading" />;

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${data?.name || "this location"}?`
      )
    )
      return;
    try {
      await mutate("locations", deleteLocation({ id }), {
        optimisticData: user?.locations?.filter(
          (location) => location.id != id
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

  let filteredResults = [];

  if (selected.length === 2)
    filteredResults = sortObjectArray(data?.items?.concat(data?.containers));

  if (selected.length === 1 && selected.includes("containers")) {
    filteredResults = data?.containers;
  } else if (selected.length === 1 && selected.includes("items")) {
    filteredResults = data?.items;
  }

  return (
    <>
      <div className="flex gap-2 items-center pb-4">
        <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
      </div>
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
        <Checkbox value="containers">Containers</Checkbox>
        <Checkbox value="items">Items</Checkbox>
      </CheckboxGroup>
      <ItemGrid classNames="my-8" gap="6">
        {filteredResults?.map((cardItem) => {
          return cardItem.hasOwnProperty("parentContainerId") ? (
            <ContainerCard key={cardItem.name} container={cardItem} />
          ) : (
            <ItemCard key={cardItem.name} item={cardItem} />
          );
        })}
      </ItemGrid>

      <EditLocation
        data={data}
        id={id}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />

      <ContextMenu
        type="location"
        onDelete={handleDelete}
        onEdit={onOpen}
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        isRemove={isRemove}
        itemList={data?.items}
        type="location"
        name={data.name}
      />
    </>
  );
};

export default Page;
