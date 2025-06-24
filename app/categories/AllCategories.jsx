import { useContext } from "react";
import { ColorCard, MasonryGrid } from "../components";
import { sortObjectArray, handleToggleSelect } from "../lib/helpers";
import { handleCategoryFavoriteClick } from "./handlers";
import ThumbnailCard from "../components/ThumbnailCard";
import { DeviceContext } from "../providers";

const AllCategories = ({
  categoryList,
  filter,
  showDelete,
  selectedCategories,
  setSelectedCategories,
  data,
}) => {
  const { view } = useContext(DeviceContext);
  const filteredResults = sortObjectArray(
    categoryList?.filter((category) =>
      category?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  const handleSelect = (categoryId) => {
    handleToggleSelect(categoryId, selectedCategories, setSelectedCategories);
  };

  return view ? (
    <MasonryGrid tablet={5} desktop={6} xl={8}>
      {filteredResults?.map((category) => {
        return (
          <ColorCard
            item={category}
            type="category"
            key={category.name}
            handleFavoriteClick={() =>
              handleCategoryFavoriteClick({ category, data })
            }
            showDelete={showDelete}
            isSelected={selectedCategories?.includes(category.id)}
            handleSelect={handleSelect}
          />
        );
      })}
    </MasonryGrid>
  ) : (
    <div className="flex gap-4 flex-wrap">
      {sortObjectArray(filteredResults)?.map((category) => {
        return (
          <ThumbnailCard
            key={category.name}
            item={category}
            type="category"
            path={`/categories/${category.id}`}
          />
        );
      })}
    </div>
  );
};

export default AllCategories;
