import { deleteMany, toggleFavorite, deleteObject } from "../lib/db";
import { notify } from "../lib/handlers";
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
        optimisticData: data?.filter((i) => !selectedItems?.includes(i.id)),
        revalidate: true,
        populateCache: false,
        rollbackOnError: true,
      }
    );
    setShowDelete(false);
    notify({
      message: `Deleted ${selectedItems?.length} ${
        selectedItems?.length === 1 ? "item" : "items"
      }`,
    });
    setSelectedItems([]);
  } catch (e) {
    notify({ isError: true });
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
    notify({
      message: add
        ? `Added ${item.name} to favorites`
        : `Removed ${item.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
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

    notify({
      message: add
        ? `Added ${data.name} to favorites`
        : `Removed ${data.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
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
    notify({ message: `Deleted ${data?.name}` });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handlePreventLongPress = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
