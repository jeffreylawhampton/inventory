import ContainerCard from "@/app/components/ContainerCard";
import { sortObjectArray } from "@/app/lib/helpers";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import EmptyCard from "@/app/components/EmptyCard";

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
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        800: 2,
        1200: 3,
        1700: 4,
        2200: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
        {sorted?.map((container) => {
          return (
            <ContainerCard
              key={container?.name}
              container={container}
              handleFavoriteClick={handleContainerFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  ) : (
    <EmptyCard
      add={() => setShowCreateContainer(true)}
      addLabel="Create a new container"
    />
  );
};

export default AllContainers;
