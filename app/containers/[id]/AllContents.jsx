import { ColorCard, GridLayout, SquareItemCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContents = ({
  filter,
  showFavorites,
  data,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
}) => {
  const itemList = [...data?.items];

  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  let filteredContainers = data.containers?.filter((container) =>
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
    <GridLayout>
      {results?.map((item) => {
        return item.hasOwnProperty("parentContainerId") ? (
          <ColorCard
            key={item.name}
            type="container"
            item={item}
            handleFavoriteClick={handleContainerFavoriteClick}
          />
        ) : (
          <SquareItemCard
            key={item.name}
            item={item}
            handleFavoriteClick={handleItemFavoriteClick}
          />
        );
      })}
    </GridLayout>
  );
};

export default AllContents;
