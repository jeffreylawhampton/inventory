import { ColorCard, MasonryGrid } from "../components";
import { sortObjectArray, handleToggleSelect } from "../lib/helpers";

const AllCategories = ({
  categoryList,
  filter,
  handleFavoriteClick,
  showDelete,
  selectedCategories,
  setSelectedCategories,
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
    <MasonryGrid tablet={4} desktop={5} xl={6}>
      {filteredResults?.map((category) => {
        return (
          <ColorCard
            item={category}
            type="category"
            key={category.name}
            handleFavoriteClick={handleFavoriteClick}
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
