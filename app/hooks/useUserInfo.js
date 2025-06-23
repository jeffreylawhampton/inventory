import useSWR from "swr";
import { fetcher } from "../lib/helpers";

export const useUserInfo = () => {
  const { data, error, isLoading } = useSWR(`/user/api/info`, fetcher);

  return {
    userInfo: data,
    isLoading,
    error,
  };
};
