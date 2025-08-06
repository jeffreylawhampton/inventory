import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CategoryListCard,
  ColorCard,
  MasonryGrid,
  ThumbnailCard,
  ThumbnailGrid,
} from "../components";
import { sortObjectArray, handleToggleSelect } from "../lib/helpers";
import { handleCategoryFavoriteClick } from "./handlers";
import { DeviceContext } from "../providers";

const AllCategories = ({
  filter,
  showDelete,
  selectedCategories,
  setSelectedCategories,
  data,
  showFavorites,
}) => {
  const { view } = useContext(DeviceContext);
  let filteredResults = data ?? [];

  if (showFavorites) {
    filteredResults = filteredResults?.filter((c) => c.favorite);
  }

  if (filter?.length) {
    filteredResults = filteredResults.filter((c) =>
      c?.name?.toLowerCase()?.includes(filter.toLowerCase())
    );
  }

  const router = useRouter();

  const handleSelect = (categoryId) => {
    handleToggleSelect(categoryId, selectedCategories, setSelectedCategories);
  };

  const handleClick = (category) => {
    showDelete
      ? handleToggleSelect(
          category.id,
          selectedCategories,
          setSelectedCategories
        )
      : router.push(`/categories/${category.id}`);
  };

  return (
    <>
      {!view ? (
        <ThumbnailGrid>
          {sortObjectArray(filteredResults)?.map((category) => {
            return (
              <ThumbnailCard
                key={category.name}
                item={category}
                type="category"
                path={`/categories/${category.id}`}
                showDelete={showDelete}
                isSelected={selectedCategories?.includes(category.id)}
                handleSelect={handleSelect}
                handleClick={handleClick}
              />
            );
          })}
        </ThumbnailGrid>
      ) : null}
      {view === 1 ? (
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
      ) : null}
      {view === 2 && filteredResults?.length ? (
        <>
          {filteredResults?.map((category) => {
            return (
              <CategoryListCard
                key={category.name}
                category={category}
                handleFavoriteClick={() =>
                  handleCategoryFavoriteClick({ category, data })
                }
                showDelete={showDelete}
                isSelected={selectedCategories?.includes(category.id)}
                handleClick={handleClick}
                data={data}
                mutateKey="/categories/api"
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default AllCategories;
