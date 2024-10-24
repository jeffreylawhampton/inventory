import ItemCard from "@/app/components/ItemCard";
import { sortObjectArray, flattenItems } from "@/app/lib/helpers";
import toast from "react-hot-toast";
import { toggleFavorite } from "@/app/lib/db";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { mutate } from "swr";

const AllItems = ({ filter, id, showFavorites, data }) => {
  const itemList = data?.items?.concat(flattenItems(data));
  const handleFavoriteClick = async (item) => {
    const add = !item.favorite;

    try {
      await mutate(
        `container${id}`,
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: data,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

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
              handleFavoriteClick={handleFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllItems;
