"use client";
import { CircularProgress, useDisclosure } from "@nextui-org/react";
import NewItem from "./NewItem";
import useSWR from "swr";
import ItemCard from "../components/ItemCard";
import { fetcher } from "../lib/fetcher";
import CreateNewButton from "../components/CreateNewButton";
import FilterDropdown from "../components/FilterDropdown";
import { useState } from "react";
import { sortObjectArray } from "../lib/helpers";
import ItemGrid from "../components/ItemGrid";

const Page = ({ searchParams }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const query = searchParams?.query || "";
  const [selected, setSelected] = useState([]);

  const { data, isLoading, error } = useSWR(
    `/items/api?search=${query}`,
    fetcher
  );
  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Failed to fetch";

  const filtered = data?.items?.filter(({ categories }) =>
    categories?.some(({ id }) => selected.includes(id?.toString()))
  );

  const itemsToShow = selected.length ? filtered : data?.items;

  return (
    <>
      <FilterDropdown
        categories={data?.categories}
        setSelected={setSelected}
        selected={selected}
      />
      <ItemGrid desktop={3}>
        {sortObjectArray(itemsToShow)?.map((item) => {
          return <ItemCard key={item.name} item={item} />;
        })}
      </ItemGrid>

      <NewItem
        data={data}
        query={query}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <CreateNewButton tooltipText="Create new item" onClick={onOpen} />
    </>
  );
};

export default Page;
