import { ColorCard, MasonryGrid } from "../components";
import { sortObjectArray, handleToggleSelect } from "../lib/helpers";
import { handleCategoryFavoriteClick } from "./handlers";

const AllCategories = ({
  categoryList,
  filter,
  showDelete,
  selectedCategories,
  setSelectedCategories,
  data,
}) => {
  const filteredResults = sortObjectArray(
    categoryList?.filter((category) =>
      category?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  const handleSelect = (categoryId) => {
    handleToggleSelect(categoryId, selectedCategories, setSelectedCategories);
  };

  return (
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
  );
};

export default AllCategories;
