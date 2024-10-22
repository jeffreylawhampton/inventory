import ContainerCard from "../components/ContainerCard";
import { sortObjectArray } from "../lib/helpers";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const AllContainers = ({ containerList, filter, handleFavoriteClick }) => {
  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        700: 2,
        1200: 3,
        1400: 4,
        2200: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
        {filteredResults?.map((container) => {
          return (
            <ContainerCard
              container={container}
              key={container.name}
              handleFavoriteClick={handleFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllContainers;
