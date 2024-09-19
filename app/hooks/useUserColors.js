import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export const useUserColors = () => {
  const { data, error, isLoading } = useSWR(`/user/api/colors`, fetcher);

  return {
    user: data,
    colors: data?.colors?.map((color) => color.hex),
    isLoading,
    error,
  };
};
