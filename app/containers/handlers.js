import { toggleFavorite } from "../lib/db";
import { mutate } from "swr";
import toast from "react-hot-toast";

export const handleItemFavoriteClick = async ({
  data,
  item,
  mutateKey,
  setContainerList,
}) => {
  const add = !item.favorite;
  const updated = [...data];
  const itemContainer = updated?.find(
    (container) => container.id === item.containerId
  );

  const itemToUpdate = itemContainer?.items?.find((i) => i.id === item.id);
  if (itemToUpdate) {
    itemToUpdate.favorite = add;
  }

  try {
    if (
      await mutate(
        mutateKey,
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      )
    ) {
      setContainerList(updated);
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    }
  } catch (e) {
    toast.error("Something went wrong");
    throw new Error(e);
  }
};
