import useSWR, { mutate } from "swr";
import { ColorCard, Loading, MasonryGrid } from "@/app/components";
import toast from "react-hot-toast";
import { toggleFavorite } from "../lib/db";
import { v4 } from "uuid";

const fetcher = async () => {
  const res = await fetch(`/homepage/api?type=containers&favorite=true`);
  const data = await res.json();
  return data.results;
};

const Containers = ({ filter }) => {
  const { data, isLoading, error } = useSWR("containerfaves", fetcher);

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;
  console.log(data);
  const filteredResults = data?.filter((con) =>
    con?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  const handleContainerFavoriteClick = async (con) => {
    const add = !con.favorite;
    const containerArray = [...data];
    const container = containerArray.find((c) => c.name === con.name);
    container.favorite = add;

    try {
      await mutate(
        "containerfaves",
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: containerArray,
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
    <MasonryGrid>
      {filteredResults?.map((container) => {
        return (
          <ColorCard
            key={v4()}
            item={container}
            isContainer
            handleFavoriteClick={handleContainerFavoriteClick}
          />
        );
      })}
    </MasonryGrid>
  );
};

export default Containers;
