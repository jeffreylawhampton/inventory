import { ColorCard, EmptyCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";
import MasonryGrid from "@/app/components/MasonryGrid";

const AllContainers = ({
  data,
  filter,
  handleContainerFavoriteClick,
  showFavorites,
  setShowCreateContainer,
}) => {
  let filteredResults = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  if (showFavorites)
    filteredResults = filteredResults?.filter((c) => c.favorite);
  const sorted = sortObjectArray(filteredResults);

  return (
    <MasonryGrid>
      {data?.containers?.length ? (
        sorted?.map((container) => {
          return (
            <ColorCard
              key={container?.name}
              item={container}
              isContainer
              handleFavoriteClick={handleContainerFavoriteClick}
            />
          );
        })
      ) : (
        <EmptyCard
          add={() => setShowCreateContainer(true)}
          addLabel="Create a new container"
        />
      )}
    </MasonryGrid>
  );
};

export default AllContainers;
