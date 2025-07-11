import useSWR from "swr";
import { fetcher } from "../lib/helpers";

export const useUserColors = () => {
  const { data, error, isLoading } = useSWR(`/api/colors`, fetcher);

  return {
    user: data,
    colors: data?.colors?.map((color) => color.hex),
    isLoading,
    error,
  };
};
