import ItemCard from "@/app/components/ItemCard";
import ItemGrid from "@/app/components/ItemGrid";
import Empty from "@/app/components/Empty";
import { sortObjectArray } from "@/app/lib/helpers";
import { fetcher } from "@/app/lib/fetcher";
import useSWR from "swr";
import Loading from "@/app/components/Loading";

const AllItems = ({ filter, id }) => {
  const { data, error, isLoading } = useSWR(
    `/api/containers/allItems/${id}`,
    fetcher
  );

  const filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";
  return (
    <ItemGrid desktop={3}>
      {sorted?.map((item) => {
        return <ItemCard key={item?.name} item={item} />;
      })}
    </ItemGrid>
  );
};

export default AllItems;
