import ColorCard from "../components/ColorCard";
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
        1600: 4,
        2200: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={12}>
        {filteredResults?.map((container) => {
          return (
            <ColorCard
              item={container}
              key={container.name}
              handleFavoriteClick={handleFavoriteClick}
              type="containers"
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllContainers;
