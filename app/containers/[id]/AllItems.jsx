import ItemCard from "@/app/components/ItemCard";
import ItemGrid from "@/app/components/ItemGrid";
import Empty from "@/app/components/Empty";
import { sortObjectArray } from "@/app/lib/helpers";
import { fetcher } from "@/app/lib/fetcher";
import useSWR from "swr";
import Loading from "@/app/components/Loading";
import toast from "react-hot-toast";
import { toggleFavorite } from "@/app/lib/db";

const AllItems = ({ filter, id, showFavorites }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/containers/allItems/${id}`,
    fetcher
  );

  const handleFavoriteClick = async ({ item }) => {
    const add = !item.favorite;
    const itemArray = [...data.items];
    const itemToUpdate = itemArray.find((i) => i.name === item.name);
    itemToUpdate.favorite = !item.favorite;

    try {
      await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
        optimisticData: {
          ...data,
          itemArray,
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  let filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((container) => container.favorite);
  }
  const sorted = sortObjectArray(filteredResults);

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";
  return (
    <ItemGrid desktop={3}>
      {sorted?.map((item) => {
        return (
          <ItemCard
            key={item?.name}
            item={item}
            handleFavoriteClick={handleFavoriteClick}
          />
        );
      })}
    </ItemGrid>
  );
};

export default AllItems;
