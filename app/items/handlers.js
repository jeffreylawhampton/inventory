import { deleteMany, toggleFavorite, deleteObject } from "../lib/db";
import toast from "react-hot-toast";
import { mutate } from "swr";

export const handleDeleteMany = async ({
  selectedItems,
  setSelectedItems,
  setShowDelete,
  data,
  mutateKey,
}) => {
  try {
    await mutate(
      mutateKey,
      deleteMany({ selected: selectedItems, type: "item" }),
      {
        optimisticData: {
          ...data,
          items: data.items?.filter((i) => !selectedItems?.includes(i.id)),
        },
        revalidate: true,
        populateCache: false,
        rollbackOnError: true,
      }
    );
    setShowDelete(false);
    toast.success(
      `Deleted ${selectedItems?.length} ${
        selectedItems?.length === 1 ? "item" : "items"
      }`
    );
    setSelectedItems([]);
  } catch (e) {
    toast.error("Something went wrong");
    throw e;
  }
};

export const handleFavoriteClick = async ({ item, data, mutateKey }) => {
  const add = !item.favorite;
  const updated = structuredClone(data);
  const itemToUpdate = updated?.find((i) => i.name === item.name);
  itemToUpdate.favorite = add;

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData: updated,
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

export const handleItemFavoriteClick = async ({ data, mutateKey }) => {
  const add = !data.favorite;
  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "item", id: data.id, add }),
      {
        optimisticData: {
          ...data,
          favorite: add,
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    toast.success(
      add
        ? `Added ${data.name} to favorites`
        : `Removed ${data.name} from favorites`
    );
  } catch (e) {
    toast.error("Something went wrong");
    throw new Error(e);
  }
};

export const handleDelete = async ({ isSafari, user, data, mutateKey }) => {
  if (
    !isSafari &&
    !confirm(`Are you sure you want to delete ${data?.name || "this item"}?`)
  )
    return;
  try {
    await mutate(
      mutateKey,
      deleteObject({ id: data.id, type: "item", navigate: "/items" }),
      {
        optimisticData: user?.items?.filter((item) => item.id != data.id),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    toast.success(`Successfully deleted ${data?.name}`);
  } catch (e) {
    toast.error("Something went wrong");
    throw e;
  }
};
