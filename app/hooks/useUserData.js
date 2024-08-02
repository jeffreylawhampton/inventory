import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export const useUserData = (selector) => {
  const { data, error, isLoading } = useSWR(`/user/api/${selector}`, fetcher);

  return {
    user: data,
    isLoading,
    error,
  };
};
