import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CategoryListCard,
  ColorCard,
  MasonryGrid,
  ThumbnailCard,
  ThumbnailGrid,
} from "../components";
import {
  sortObjectArray,
  checkSelected,
  handleToggleDelete,
} from "../lib/helpers";
import { handleCategoryFavoriteClick } from "./handlers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";

const AllCategories = ({ data }) => {
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);
  const { isSafari } = useContext(DeviceContext);
  const { showDelete } = useContext(ModalContext);
  const { filter, showFavorites, view } = useContext(FilterContext);
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

  const handleClick = (category) => {
    console.log(category);
    showDelete
      ? handleToggleDelete(
          category,
          "name",
          selectedObjects,
          setSelectedObjects
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
                isSelected={checkSelected(category, selectedObjects)}
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
                isSelected={checkSelected(category, selectedObjects)}
                handleClick={handleClick}
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
                isSelected={checkSelected(category, selectedObjects)}
                handleClick={handleClick}
                data={data}
                mutateKey="/categories/api"
                isSafari={isSafari}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default AllCategories;
