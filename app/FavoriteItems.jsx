"use client";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";
import Loading from "./components/Loading";
import ItemCard from "./components/ItemCard";
import { ScrollArea } from "@mantine/core";
import { v4 } from "uuid";

const FavoriteItems = () => {
  const { data, error, isLoading } = useSWR("/user/api/favorites", fetcher);

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;

  return (
    <div className="w-full overflow-x-scroll h-fit min-h-[320px] grid grid-flow-col gap-3">
      {data?.items?.map((item) => {
        return (
          <ItemCard
            item={item}
            key={v4()}
            showFavorite={false}
            rootClasses="min-w-[300px]"
          />
        );
      })}
    </div>
  );
};

export default FavoriteItems;
