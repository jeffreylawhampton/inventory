import { ColorCard, MasonryGrid } from "../components";
import { sortObjectArray } from "../lib/helpers";

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

  const handleSelect = (category) => {
    setSelectedCategories(
      selectedCategories?.includes(category)
        ? selectedCategories.filter((cat) => cat != category)
        : [...selectedCategories, category]
    );
  };

  return (
    <MasonryGrid tablet={4} desktop={5} xl={6}>
      {filteredResults?.map((category) => {
        return (
          <ColorCard
            item={category}
            type="categories"
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
