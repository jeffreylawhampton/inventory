import { EmptyCard, SquareItemCard } from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";
import { ItemCardMasonry } from "@/app/components";

const AllItems = ({
  filter,
  id,
  showFavorites,
  data,
  handleItemFavoriteClick,
  setShowCreateItem,
  handleAdd,
}) => {
  const itemList = [...data?.items];

  data?.containerArray?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  let filteredResults = itemList?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((container) => container.favorite);
  }
  const sorted = sortObjectArray(filteredResults);

  return itemList?.length ? (
    <div className="pb-8">
      <ItemCardMasonry>
        {sorted?.map((item) => {
          return (
            <SquareItemCard
              key={item?.name}
              item={item}
              handleFavoriteClick={handleItemFavoriteClick}
            />
          );
        })}
      </ItemCardMasonry>
    </div>
  ) : (
    <EmptyCard move={handleAdd} add={() => setShowCreateItem(true)} />
  );
};

export default AllItems;
