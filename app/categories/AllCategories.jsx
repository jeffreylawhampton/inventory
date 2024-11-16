import CategoryCard from "../components/CategoryCard";
import { sortObjectArray } from "../lib/helpers";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const AllCategories = ({ categoryList, filter, handleFavoriteClick }) => {
  const filteredResults = sortObjectArray(
    categoryList?.filter((category) =>
      category?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        700: 2,
        1200: 3,
        1600: 4,
        2200: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
        {filteredResults?.map((category) => {
          return (
            <CategoryCard
              category={category}
              key={category.name}
              handleFavoriteClick={handleFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllCategories;
