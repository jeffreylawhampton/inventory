import { mutate } from "swr";
import {
  deleteObject,
  toggleFavorite,
  deleteMany,
  removeCategoryItems,
} from "../lib/db";
import { sortObjectArray } from "../lib/helpers";
import { notify } from "../lib/handlers";

export const handleDeleteSingle = async ({
  data,
  isSafari,
  mutateKey = "categories",
  user,
}) => {
  if (
    !isSafari &&
    !confirm(`Are you sure you want to delete ${data?.name || "this item"}`)
  )
    return;
  try {
    await mutate(
      mutateKey,
      deleteObject({ id: data.id, type: "category", navigate: "/categories" }),
      {
        optimisticData: sortObjectArray(user?.categories)?.filter(
          (category) => category.id != data.id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    notify({ message: `Successfully deleted ${data?.name}` });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleDeleteMany = async ({
  data,
  setShowDelete,
  selectedCategories,
  setSelectedCategories,
  mutateKey,
}) => {
  try {
    await mutate(
      mutateKey,
      deleteMany({ selected: selectedCategories, type: "category" }),
      {
        optimisticData: structuredClone(data)?.filter(
          (c) => !selectedCategories?.includes(c.id)
        ),
        populateCache: false,
        revalidate: true,
        rollbackOnError: true,
      }
    );
    setShowDelete(false);
    notify({
      message: `Deleted ${selectedCategories?.length} ${
        selectedCategories?.length === 1 ? "category" : "categories"
      }`,
    });
    setSelectedCategories([]);
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleCategoryFavoriteClick = async ({ category, data }) => {
  const add = !category.favorite;
  const categoryArray = [...data];
  const categoryToUpdate = categoryArray.find((i) => i.name === category.name);
  categoryToUpdate.favorite = !category.favorite;

  try {
    if (
      await mutate(
        "categories",
        toggleFavorite({ type: "category", id: category.id, add }),
        {
          optimisticData: categoryArray,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      )
    ) {
      notify({
        message: add
          ? `Added ${category.name} to favorites`
          : `Removed ${category.name} from favorites`,
      });
    }
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleItemFavoriteClick = async ({ item, data, mutateKey }) => {
  const add = !item.favorite;
  const itemArray = [...data.items];
  const itemToUpdate = itemArray.find((i) => i.name === item.name);
  itemToUpdate.favorite = add;

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData: {
          ...data,
          itemArray,
        },
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

export const handleRemove = async ({
  data,
  mutateKey,
  setShowRemove,
  selectedItems,
  setSelectedItems,
}) => {
  const duplicate = { ...data };

  duplicate.items = duplicate.items.filter(
    (item) => !selectedItems?.includes(item.id)
  );
  duplicate.items = sortObjectArray(duplicate.items);

  try {
    await mutate(
      mutateKey,
      removeCategoryItems({
        id: data.id,
        items: selectedItems,
      }),
      {
        optimisticData: duplicate,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    notify({
      message: `Removed ${selectedItems.length} ${
        selectedItems.length === 1 ? "item" : "items"
      } from ${data.name}`,
    });
    setShowRemove(false);
    setSelectedItems([]);
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};
