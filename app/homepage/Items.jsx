import useSWR from "swr";
import { SquareItemCard, ItemCardMasonry, Loading } from "@/app/components";
import { fetcher } from "../lib/fetcher";
import toast from "react-hot-toast";
import { toggleFavorite } from "../lib/db";

const Items = ({ filter }) => {
  const { data, isLoading, error, mutate } = useSWR(
    "items/api?favorite=true&search=",
    fetcher
  );

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;

  const filteredResults = data?.items?.filter(
    (item) =>
      item.name?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.description?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.purchasedAt?.toLowerCase()?.includes(filter?.toLowerCase())
  );
  const handleItemFavoriteClick = async (item) => {
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
  };

  return (
    <ItemCardMasonry>
      {filteredResults?.map((item) => {
        return (
          <SquareItemCard
            item={item}
            key={item.name}
            handleFavoriteClick={handleItemFavoriteClick}
          />
        );
      })}
    </ItemCardMasonry>
  );
};

export default Items;
