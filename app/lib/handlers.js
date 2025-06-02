import toast from "react-hot-toast";
import { mutate } from "swr";
import { toggleFavorite } from "./db";

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
