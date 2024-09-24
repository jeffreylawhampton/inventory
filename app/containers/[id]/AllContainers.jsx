import ContainerCard from "@/app/components/ContainerCard";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import Loading from "@/app/components/Loading";

const AllContainers = ({ filter, id }) => {
  const { data, error, isLoading } = useSWR(
    `/api/containers/allContainers/${id}`,
    fetcher
  );

  const filteredResults = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);

  if (isLoading) return <Loading />;
  return (
    <ItemGrid desktop={4} gap={3}>
      {sorted?.map((container) => {
        return <ContainerCard key={container?.name} container={container} />;
      })}
    </ItemGrid>
  );
};

export default AllContainers;
