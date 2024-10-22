import ContainerCard from "@/app/components/ContainerCard";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContainers = ({ data, filter, handleContainerFavoriteClick }) => {
  const filteredResults = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);
  return (
    <ItemGrid desktop={3} gap={3}>
      {sorted?.map((container) => {
        return (
          <ContainerCard
            key={container?.name}
            container={container}
            handleFavoriteClick={handleContainerFavoriteClick}
          />
        );
      })}
    </ItemGrid>
  );
};

export default AllContainers;
