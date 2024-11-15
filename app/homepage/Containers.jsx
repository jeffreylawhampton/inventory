import useSWR from "swr";
import Loading from "../components/Loading";
import MasonryContainer from "../components/MasonryContainer";
import toast from "react-hot-toast";
import { toggleFavorite } from "../lib/db";
import ContainerCard from "../components/ContainerCard";
import { v4 } from "uuid";

const fetcher = async () => {
  const res = await fetch(`/containers/api?favorite=true`);
  return await res.json();
};

const Containers = () => {
  const { data, isLoading, error, mutate } = useSWR(
    "favoritecontainers",
    fetcher
  );

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;

  const handleContainerFavoriteClick = async (con) => {
    const add = !con.favorite;
    const containerArray = [...data.containers];
    const container = containerArray.find((c) => c.name === con.name);
    container.favorite = add;

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: {
            ...data,
            containerArray,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  return (
    <MasonryContainer gutter={8}>
      {data?.containers?.map((container) => {
        return (
          <ContainerCard
            key={v4()}
            container={container}
            handleFavoriteClick={handleContainerFavoriteClick}
          />
        );
      })}
    </MasonryContainer>
  );
};

export default Containers;
