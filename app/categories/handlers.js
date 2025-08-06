import { mutate } from "swr";
import {
  deleteObject,
  toggleFavorite,
  deleteMany,
  updateCategory,
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

export const handleDeleteCategory = async ({ category, data }) => {
  if (confirm(`Delete ${category?.name ?? "category"}?`)) {
    try {
      await mutate(
        "/categories/api",
        deleteObject({ id: category.id, type: "category", navigate: false }),
        {
          optimisticData: data?.filter((c) => c.id != category.id),
          rollbackOnError: true,
          revalidate: true,
          populateCache: false,
        }
      );
      notify({ message: `Deleted ${category?.name ?? "category"}` });
    } catch (e) {
      throw new Error(e);
    }
  }
};

export const handleUpdateCategory = async ({
  editedCategory,
  category,
  formError,
  close,
  data,
}) => {
  if (formError) return;
  if (
    editedCategory?.name === category?.name &&
    editedCategory?.color === category?.color
  )
    return close();
  try {
    await mutate("/categories/api", updateCategory(editedCategory), {
      optimisticData: data?.map((c) =>
        c.id === category.id ? { ...c, ...editedCategory } : c
      ),
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    });
    close();
    notify({ message: `${category?.name} updated` });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleCategoryFavoriteClick = async ({ category, data }) => {
  const add = !category.favorite;
  try {
    if (
      await mutate(
        "/categories/api",
        toggleFavorite({ type: "category", id: category.id, add }),
        {
          optimisticData: data?.map((c) =>
            c.id === category.id ? { ...c, favorite: add } : c
          ),
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
