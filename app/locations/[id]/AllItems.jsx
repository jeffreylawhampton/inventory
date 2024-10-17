import ItemCard from "@/app/components/ItemCard";
import ItemGrid from "@/app/components/ItemGrid";
import Empty from "@/app/components/Empty";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { sortObjectArray } from "@/app/lib/helpers";

const AllItems = ({ data, filter, handleAdd, handleItemFavoriteClick }) => {
  const filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        600: 2,
        1000: 3,
        1400: 4,
        2000: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow`} gutter={14}>
        {!data?.items?.length ? <Empty onClick={handleAdd} /> : null}
        {sorted?.map((item) => {
          return (
            <ItemCard
              key={item?.name}
              item={item}
              handleFavoriteClick={handleItemFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllItems;
