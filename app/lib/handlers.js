import toast from "react-hot-toast";
import { mutate } from "swr";
import { addIcon, toggleFavorite, deleteImages } from "./db";

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
    toast.success(
      add
        ? `Added ${data?.name} to favorites`
        : `Removed ${data?.name} from favorites`
    );
  } catch (e) {
    toast.error("Something went wrong");
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
    toast.success("Deleted image");
  } catch (e) {
    toast.error("Something went wrong");
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
    toast.success("Icon updated");
  } catch (e) {
    toast.error("Something went wrong");
    throw new Error(e);
  }
};
