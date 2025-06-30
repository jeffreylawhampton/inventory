import { useContext } from "react";
import {
  ColorCard,
  GridLayout,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/providers";

const AllContents = ({
  filter,
  showFavorites,
  categoryFilters,
  data,
  itemList,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
}) => {
  const { view } = useContext(DeviceContext);
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

  return view ? (
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
  ) : (
    <ThumbnailGrid>
      {results?.map((item) => {
        const type = item?.hasOwnProperty("containerId") ? "item" : "container";
        return (
          <ThumbnailCard
            key={item.name}
            item={item}
            type={type}
            path={`/${type}s/${item.id}`}
          />
        );
      })}
    </ThumbnailGrid>
  );
};

export default AllContents;
