import useSWR from "swr";
import { fetcher } from "../lib/helpers";

export const useUser = () => {
  const { data, error, isLoading } = useSWR(`/user/api`, fetcher);

  return {
    user: data,
    isLoading,
    error,
  };
};
