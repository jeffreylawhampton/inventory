import ContainerCard from "@/app/components/ContainerCard";
import MasonryContainer from "@/app/components/MasonryContainer";
import { sortObjectArray } from "@/app/lib/helpers";
import EmptyCard from "@/app/components/EmptyCard";

const AllContainers = ({
  data,
  filter,
  handleContainerFavoriteClick,
  showFavorites,
  showCreateContainer,
  setShowCreateContainer,
}) => {
  let filteredResults = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  if (showFavorites)
    filteredResults = filteredResults?.filter((c) => c.favorite);
  const sorted = sortObjectArray(filteredResults);

  return (
    <MasonryContainer gutter={8}>
      {data?.containers?.length ? (
        sorted?.map((container) => {
          return (
            <ContainerCard
              key={container?.name}
              container={container}
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
    </MasonryContainer>
  );
};

export default AllContainers;
