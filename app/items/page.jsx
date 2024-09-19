"use client";
import NewItem from "./NewItem";
import useSWR from "swr";
import ItemCard from "../components/ItemCard";
import { fetcher } from "../lib/fetcher";
import { useContext } from "react";
import { sortObjectArray } from "../lib/helpers";
import ItemGrid from "../components/ItemGrid";
import { useViewportSize } from "@mantine/hooks";
import { ScrollArea } from "@mantine/core";
import { FilterContext } from "./layout";
import Loading from "../components/Loading";

const Page = ({ searchParams }) => {
  const query = searchParams?.query || "";
  const { height } = useViewportSize();
  const maxHeight = height * 0.72;
  const { data, isLoading, error } = useSWR(
    `/items/api?search=${query}`,
    fetcher
  );

  const { selected, opened, close } = useContext(FilterContext);

  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

  const filtered = data?.items?.filter(({ categories }) =>
    categories?.some(({ id }) => selected?.includes(id))
  );

  const itemsToShow = selected?.length ? filtered : data?.items;

  return (
    <>
      <ScrollArea.Autosize
        mah={maxHeight}
        classNames={{
          viewport: "pb-16",
        }}
      >
        <ItemGrid desktop={3}>
          {sortObjectArray(itemsToShow)?.map((item) => {
            return <ItemCard key={item.name} item={item} showLocation />;
          })}
        </ItemGrid>
      </ScrollArea.Autosize>
      <NewItem data={data} opened={opened} close={close} />
    </>
  );
};

export default Page;
