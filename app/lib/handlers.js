import { mutate } from "swr";
import {
  addIcon,
  toggleFavorite,
  deleteImages,
  featuredImage,
  unfeatureImage,
} from "./db";
import { notifications } from "@mantine/notifications";
import { X, Check } from "lucide-react";

export const mutateProps = {
  rollbackOnError: true,
  revalidate: true,
  populateCache: false,
};
export const notify = ({
  isError,
  message = isError ? "Something went wrong" : "",
  autoClose = 1500,
  radius = "xl",
  position = "top-center",
}) => {
  return notifications.show({
    position,
    radius,
    autoClose,
    message,
    icon: isError ? <X /> : <Check />,
    color: isError ? "danger.4" : "success.0",
  });
};

export const handleFavoriteClick = async ({ data, key, type }) => {
  const add = !data?.favorite;

  try {
    await mutate(key, toggleFavorite({ id: data?.id, type, add }), {
      optimisticData: {
        ...data,
        favorite: add,
      },
      populateCache: false,
      revalidate: true,
      rollbackOnError: true,
    });
    notify({
      message: add
        ? `Added ${data?.name} to favorites`
        : `Removed ${data?.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleDeleteImages = async ({
  imagesToDelete,
  mutateKey,
  item,
  userId,
}) => {
  try {
    await mutate(mutateKey, deleteImages({ imagesToDelete, userId }), {
      optimisticData: {
        ...item,
        images: item?.images?.filter((i) => !imagesToDelete?.includes(i)),
      },
      revalidate: true,
      populateCache: false,
      rollbackOnError: true,
    });
    notify({
      message: `Deleted ${imagesToDelete?.length} image${
        imagesToDelete?.length > 1 ? "s" : ""
      }`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleFeaturedImage = async ({
  data,
  imageId,
  mutateKey,
  additionalMutate = "/",
}) => {
  try {
    await mutate(mutateKey, featuredImage({ itemId: data?.id, imageId }), {
      optimisticData: {
        ...data,
        images: data?.images
          ?.map((i) => {
            return { ...i, featured: i.id === imageId };
          })
          ?.sort((a, b) => b.featured - a.featured),
      },
      revalidate: true,
      populateCache: false,
      rollbackOnError: true,
    });
    mutate(additionalMutate);
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleUnfeatureImage = async ({ data, imageId, mutateKey }) => {
  try {
    await mutate(mutateKey, unfeatureImage(imageId), {
      optimisticData: {
        ...data,
        images: data?.images?.map((i) =>
          i.id === imageId ? { ...i, featured: false } : i
        ),
      },
      revalidate: true,
      rollbackOnError: true,
      populateCache: false,
    });
  } catch (e) {
    throw new Error(e);
  }
};

export const handleAddIcon = async ({
  data,
  item,
  type,
  mutateKey,
  iconName,
  additionalMutate,
}) => {
  let updated;
  if (data && item) {
    updated = structuredClone(data);
    if (type === "item" && updated?.items) {
      const itemToUpdate = updated?.items?.find((i) => i.id === item.id);
      itemToUpdate.icon = iconName;
    } else if (type === "container" && updated?.containers) {
      const itemToUpdate = updated?.containers?.find(
        (con) => con.id === item.id
      );
      itemToUpdate.icon = iconName;
    } else if (type === "category" && updated?.categories) {
      const itemToUpdate = updated?.categories?.find(
        (cat) => cat.id === item.id
      );
      itemToUpdate.icon = iconName;
    } else {
      const itemToUpdate = updated?.find((i) => i.id === item.id);
      itemToUpdate.icon = iconName;
    }
  } else {
    if (data?.icon === iconName) return;
    updated = structuredClone(data);
    updated.icon = iconName;
  }

  const id = data && item ? item.id : data.id;

  try {
    await mutate(mutateKey, addIcon({ id, type, iconName }), {
      optimisticData: updated,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    });
    mutate(additionalMutate);

    notify({ message: "Icon updated" });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};
