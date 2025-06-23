import { ColorCard, GridLayout, SquareItemCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContents = ({
  filter,
  showFavorites,
  categoryFilters,
  data,
  itemList,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
}) => {
  let filteredContainers = data.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  let filteredItems = itemList?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter.toLowerCase())
  );

  if (categoryFilters?.length) {
    filteredContainers = [];
    filteredItems = filteredItems?.filter((i) =>
      i.categories?.some((cat) => categoryFilters.find((c) => c.id === cat.id))
    );
  }

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
