import { useQuery } from "@tanstack/react-query";

const fetchUser = async () => {
  try {
    const res = await fetch("/user/api");
    const data = await res.json();
    return data?.user;
  } catch (e) {
    throw new Error(e);
  }
};

export const useUser = () => {
  const { isPending, error, data, isFetching, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return { user: data, isLoading, isFetching, isPending, error };
};
