import ItemCard from "@/app/components/ItemCard";
import { sortObjectArray } from "@/app/lib/helpers";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const AllItems = ({
  filter,
  id,
  showFavorites,
  data,
  handleItemFavoriteClick,
}) => {
  const itemList = [...data?.items];
  data?.containerArray?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  let filteredResults = itemList?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((container) => container.favorite);
  }
  const sorted = sortObjectArray(filteredResults);

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        600: 2,
        1000: 3,
        1500: 4,
        2000: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow`} gutter={14}>
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
