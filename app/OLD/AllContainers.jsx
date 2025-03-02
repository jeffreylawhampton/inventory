import { ColorCard, EmptyCard, MasonryGrid } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContainers = ({
  filter,
  showFavorites,
  data,
  handleContainerFavoriteClick,
  setShowCreateContainer,
}) => {
  const allContainerArray = data.containerArray;

  let filteredResults = allContainerArray?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((container) => container.favorite);
  }
  const sorted = sortObjectArray(filteredResults);

  return allContainerArray?.length ? (
    <MasonryGrid>
      {sorted?.map((container) => {
        return (
          <ColorCard
            key={container?.name}
            item={container}
            handleFavoriteClick={handleContainerFavoriteClick}
            isContainer
          />
        );
      })}
    </MasonryGrid>
  ) : (
    <EmptyCard
      add={() => setShowCreateContainer(true)}
      addLabel="Create a new container"
    />
  );
};

export default AllContainers;
