import { mutate } from "swr";
import { addIcon, toggleFavorite, deleteImages } from "./db";
import { notifications } from "@mantine/notifications";
import { X, Check } from "lucide-react";

export const notify = ({
  isError,
  message = "",
  autoClose = 1500,
  radius = "xl",
  position = "top-center",
}) => {
  const errorMessage = "Something went wrong";
  return notifications.show({
    position,
    radius,
    autoClose,
    message: isError ? errorMessage : message,
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

export const handleAddIcon = async ({
  data,
  type,
  mutateKey,
  iconName,
  additionalMutate,
}) => {
  const updated = structuredClone(data);
  updated.icon = iconName;
  try {
    await mutate(mutateKey, addIcon({ data, type, iconName }), {
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
