"use client";
import NewItem from "./NewItem";
import useSWR from "swr";
import ItemCard from "../components/ItemCard";
import { fetcher } from "../lib/fetcher";
import { useContext } from "react";
import { sortObjectArray } from "../lib/helpers";
import ItemGrid from "../components/ItemGrid";
import { FilterContext } from "./layout";
import Loading from "../components/Loading";

const Page = ({ searchParams }) => {
  const query = searchParams?.query || "";
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
    <div className="pb-12">
      <ItemGrid desktop={3}>
        {sortObjectArray(itemsToShow)?.map((item) => {
          return <ItemCard key={item.name} item={item} showLocation />;
        })}
      </ItemGrid>
      <NewItem data={data} opened={opened} close={close} />
    </div>
  );
};

export default Page;
