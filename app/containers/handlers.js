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

export const handleContainerFavoriteClick = async ({ container, data }) => {
  const add = !container.favorite;
  const containerArray = [...data];
  const containerToUpdate = containerArray.find(
    (i) => i.name === container.name
  );
  containerToUpdate.favorite = !container.favorite;

  try {
    if (
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: containerArray,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      )
    ) {
      setContainerList(containerArray);
      toast.success(
        add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`
      );
    }
  } catch (e) {
    toast.error("Something went wrong");
    throw new Error(e);
  }
};
