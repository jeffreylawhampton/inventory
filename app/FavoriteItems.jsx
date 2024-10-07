"use client";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";
import Loading from "./components/Loading";
import ItemCard from "./components/ItemCard";
import { v4 } from "uuid";

const FavoriteItems = () => {
  const { data, error, isLoading } = useSWR("/user/api/favorites", fetcher);

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <div className="w-full overflow-x-auto h-[320px] min-h-[320px] grid grid-flow-col gap-3">
      {data?.items?.map((item) => {
        return <ItemCard item={item} key={v4()} showFavorite={false} />;
      })}
    </div>
  );
};

export default FavoriteItems;
