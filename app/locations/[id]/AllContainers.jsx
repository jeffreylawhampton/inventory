import ContainerCard from "@/app/components/ContainerCard";
import MasonryContainer from "@/app/components/MasonryContainer";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContainers = ({
  data,
  filter,
  handleContainerFavoriteClick,
  showFavorites,
}) => {
  let filteredResults = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  if (showFavorites)
    filteredResults = filteredResults?.filter((c) => c.favorite);
  const sorted = sortObjectArray(filteredResults);

  return (
    <MasonryContainer gutter={8}>
      {sorted?.map((container) => {
        return (
          <ContainerCard
            key={container?.name}
            container={container}
            handleFavoriteClick={handleContainerFavoriteClick}
          />
        );
      })}
    </MasonryContainer>
  );
};

export default AllContainers;
