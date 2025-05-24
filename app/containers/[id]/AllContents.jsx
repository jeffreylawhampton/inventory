import { ColorCard, MasonryGrid, SquareItemCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContents = ({
  filter,
  showFavorites,
  data,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
}) => {
  const itemList = [...data?.items];

  data?.containerArray?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  let filteredContainers = data.containerArray?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  let filteredItems = itemList?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredContainers = filteredContainers.filter((con) => con.favorite);
    filteredItems = filteredItems.filter((i) => i.favorite);
  }

  const results = sortObjectArray(filteredContainers)?.concat(
    sortObjectArray(filteredItems)
  );

  return (
    <MasonryGrid>
      {results?.map((item) => {
        return item.hasOwnProperty("parentContainerId") ? (
          <ColorCard
            key={item.name}
            item={item}
            handleFavoriteClick={handleContainerFavoriteClick}
            isContainer
          />
        ) : (
          <SquareItemCard
            key={item.name}
            item={item}
            handleFavoriteClick={handleItemFavoriteClick}
          />
        );
      })}
    </MasonryGrid>
  );
};

export default AllContents;
