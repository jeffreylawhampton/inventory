import ContainerCard from "@/app/components/ContainerCard";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";
import useSWR from "swr";
import Loading from "@/app/components/Loading";
import toast from "react-hot-toast";
import { toggleFavorite } from "@/app/lib/db";

const fetcher = async (id) => {
  const res = await fetch(`/api/containers/allContainers/${id}`);
  const data = await res.json();
  return data?.containers;
};

const AllContainers = ({ filter, id }) => {
  const { data, error, isLoading, mutate } = useSWR("allContainers", () =>
    fetcher(id)
  );

  const handleFavoriteClick = async ({ container }) => {
    const add = !container.favorite;
    const containers = [...data];
    const containerToUpdate = containers.find((con) => con.id === container.id);
    containerToUpdate.favorite = add;

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: containers,
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

  const filteredResults = data?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);

  if (isLoading) return <Loading />;
  return (
    <ItemGrid desktop={4} gap={3}>
      {sorted?.map((container) => {
        return (
          <ContainerCard
            key={container?.name}
            container={container}
            handleFavoriteClick={handleFavoriteClick}
          />
        );
      })}
    </ItemGrid>
  );
};

export default AllContainers;
