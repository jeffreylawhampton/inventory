import { EmptyCard, ItemCard, ItemCardMasonry } from "@/app/components";
import SquareItemCard from "@/app/components/SquareItemCard";
import { sortObjectArray } from "@/app/lib/helpers";

const AllItems = ({
  data,
  filter,
  handleAdd,
  handleItemFavoriteClick,
  showFavorites,
  setShowCreateItem,
}) => {
  const itemList = [...data?.items];

  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );
  let filteredResults = itemList?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites)
    filteredResults = filteredResults?.filter((i) => i.favorite);

  const sorted = sortObjectArray(filteredResults);

  return (
    <ItemCardMasonry>
      {itemList?.length ? (
        sorted?.map((item) => {
          return (
            <SquareItemCard
              key={item?.name}
              item={item}
              handleFavoriteClick={handleItemFavoriteClick}
            />
          );
        })
      ) : (
        <EmptyCard add={() => setShowCreateItem(true)} move={handleAdd} />
      )}
    </ItemCardMasonry>
  );
};

export default AllItems;
