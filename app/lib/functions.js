import toast from "react-hot-toast";
import { mutate } from "swr";
import { toggleFavorite } from "./db";

export const handleItemFavoriteClick = async (item, mutationKey) => {
  const add = !item.favorite;
  try {
    await mutate(
      mutationKey,
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData: data,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
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
