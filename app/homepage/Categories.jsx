import useSWR, { mutate } from "swr";
import { ColorCard, Loading, MasonryGrid } from "@/app/components";
import toast from "react-hot-toast";
import { toggleFavorite } from "../lib/db";
import { v4 } from "uuid";

const fetcher = async () => {
  const res = await fetch("/categories/api?favorite=true");
  const data = await res.json();
  return data.categories;
};

const Categories = ({ filter }) => {
  const { data, isLoading, error } = useSWR(
    "/categories/api?favorite=true",
    fetcher
  );

  if (error) return "Something went wrong";
  if (isLoading) return <Loading />;

  const filteredResults = data?.filter((cat) =>
    cat?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  const handleCategoryFavoriteClick = async (cat) => {
    const add = !cat.favorite;
    const categoryArray = [...data];
    const category = categoryArray.find((c) => c.name === cat.name);
    category.favorite = add;

    try {
      await mutate(
        "/categories/api?favorite=true",
        toggleFavorite({ type: "category", id: category.id, add }),
        {
          optimisticData: categoryArray,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${category.name} to favorites`
          : `Removed ${category.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  return (
    <MasonryGrid>
      {filteredResults?.map((category) => {
        return (
          <ColorCard
            key={v4()}
            item={category}
            handleFavoriteClick={handleCategoryFavoriteClick}
          />
        );
      })}
    </MasonryGrid>
  );
};

export default Categories;
