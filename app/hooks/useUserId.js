import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export const useUserId = () => {
  const { data, error, isLoading } = useSWR(`/user/api/info`, fetcher);

  return {
    user: data,
    isLoading,
    error,
  };
};
