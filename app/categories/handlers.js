import toast from "react-hot-toast";
import { mutate } from "swr";
import {
  deleteObject,
  toggleFavorite,
  deleteMany,
  removeCategoryItems,
} from "../lib/db";
import { sortObjectArray } from "../lib/helpers";

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
    toast.success(`Successfully deleted ${data?.name}`);
  } catch (e) {
    toast.error("Something went wrong");
    throw e;
  }
};

export const handleDeleteMany = async ({
  data,
  setShowDelete,
  selectedCategories,
  setSelectedCategories,
}) => {
  try {
    await mutate(
      "categories",
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
    toast.success(
      `Deleted ${selectedCategories?.length} ${
        selectedCategories?.length === 1 ? "category" : "categories"
      }`
    );
    setSelectedCategories([]);
  } catch (e) {
    toast.error("Something went wrong");
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
      toast.success(
        add
          ? `Added ${category.name} to favorites`
          : `Removed ${category.name} from favorites`
      );
    }
  } catch (e) {
    toast.error("Something went wrong");
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

    toast.success(
      `Removed ${selectedItems.length} ${
        selectedItems.length === 1 ? "item" : "items"
      } from ${data.name}`
    );

    setShowRemove(false);
    setSelectedItems([]);
  } catch (e) {
    toast.error("Something went wrong");
    throw new Error(e);
  }
};
