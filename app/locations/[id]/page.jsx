"use client";
import { useState } from "react";
import { deleteLocation } from "../api/db";
import toast from "react-hot-toast";
import EditLocation from "../EditLocation";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import ItemCard from "@/app/components/ItemCard";
import MasonryContainer from "@/app/components/MasonryContainer";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import { sortObjectArray } from "@/app/lib/helpers";
import SearchFilter from "@/app/components/SearchFilter";
import { useDisclosure } from "@mantine/hooks";
import Loading from "@/app/components/Loading";
import ContainerAccordion from "@/app/components/ContainerAccordion";
import { Chip } from "@mantine/core";
import FilterChip from "@/app/components/Chip";
import Empty from "@/app/components/Empty";

const fetcher = async (id) => {
  const res = await fetch(`/locations/api/${id}`);
  const data = await res.json();
  return data.location;
};

const Page = ({ params: { id } }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState(["containers", "items"]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const { user } = useUser();
  const { data, error, isLoading } = useSWR(`location${id}`, () => fetcher(id));

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

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex gap-2 items-center pb-4">
        <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
      </div>
      <SearchFilter
        label={"Search for an item or container"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <div className="flex gap-1">
        <Chip.Group value={selected} onChange={setSelected} multiple>
          <FilterChip value={"containers"}>Containers</FilterChip>
          <FilterChip value={"items"}>Items</FilterChip>
        </Chip.Group>
      </div>
      <MasonryContainer>
        {!data?.items?.length && !data?.containers?.length ? (
          <Empty onClick={handleAdd} />
        ) : null}
        {filteredResults?.map((cardItem) => {
          return cardItem?.hasOwnProperty("parentContainerId") ? (
            <ContainerAccordion key={cardItem?.name} container={cardItem} />
          ) : (
            <ItemCard key={cardItem?.name} item={cardItem} />
          );
        })}
      </MasonryContainer>

      <EditLocation
        data={data}
        id={id}
        opened={opened}
        open={open}
        close={close}
      />

      <ContextMenu
        type="location"
        onDelete={handleDelete}
        onEdit={open}
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        isRemove={isRemove}
        itemList={data?.items}
        type="location"
        name={data?.name}
      />
    </>
  );
};

export default Page;
