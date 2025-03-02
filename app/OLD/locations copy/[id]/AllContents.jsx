import { ColorCard, EmptyCard, SquareItemCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";
import MasonryGrid from "@/app/components/MasonryGrid";

const AllContents = ({
  data,
  filter,
  handleContainerFavoriteClick,
  showFavorites,
  setShowCreateContainer,
  handleItemFavoriteClick,
  handleSelectContainers,
  handleSelectItems,
  selectedItems,
  selectedContainers,
  showRemove,
}) => {
  const itemList = [...data?.items];

  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );
  let filteredContainers = data?.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  let filteredItems = itemList?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  let filteredResults = sortObjectArray(filteredContainers).concat(
    sortObjectArray(filteredItems)
  );
  if (showFavorites)
    filteredResults = filteredResults?.filter((c) => c.favorite);

  return (
    <MasonryGrid>
      {filteredResults?.length ? (
        filteredResults?.map((item) => {
          return item?.hasOwnProperty("parentContainerId") ? (
            <ColorCard
              key={item?.name}
              item={item}
              isContainer
              handleFavoriteClick={handleContainerFavoriteClick}
              isSelected={selectedContainers?.includes(item.id)}
              handleSelect={handleSelectContainers}
              showDelete={showRemove}
            />
          ) : (
            <SquareItemCard
              key={item?.name}
              item={item}
              handleFavoriteClick={handleItemFavoriteClick}
              isSelected={selectedItems?.includes(item.id)}
              handleSelect={handleSelectItems}
              showDelete={showRemove}
            />
          );
        })
      ) : (
        <EmptyCard
          add={() => setShowCreateContainer(true)}
          addLabel="Create a new container"
        />
      )}
    </MasonryGrid>
  );
};

export default AllContents;
