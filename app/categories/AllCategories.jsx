import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CategoryListCard,
  ColorCard,
  MasonryGrid,
  ThumbnailCard,
  ThumbnailGrid,
} from "../components";
import { checkSelected, handleToggleDelete } from "../lib/helpers";
import { handleCategoryFavoriteClick } from "./handlers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";
import { orderBy } from "lodash";

const AllCategories = ({ data }) => {
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);
  const { isSafari } = useContext(DeviceContext);
  const { showDelete } = useContext(ModalContext);
  const {
    filter,
    setFilter,
    iconFilters,
    colorFilters,
    showFavorites,
    view,
    sortType,
    sortDirection,
  } = useContext(FilterContext);
  let filteredResults = data ?? [];

  if (showFavorites) {
    filteredResults = filteredResults?.filter((c) => c.favorite);
  }

  if (filter?.length) {
    filteredResults = filteredResults.filter((c) =>
      c?.name?.toLowerCase()?.includes(filter.toLowerCase())
    );
  }

  if (iconFilters?.length) {
    filteredResults = filteredResults?.filter((c) =>
      iconFilters?.includes(c.icon)
    );
  }

  if (colorFilters?.length) {
    filteredResults = filteredResults?.filter((c) =>
      colorFilters?.includes(c?.color?.hex)
    );
  }

  filteredResults = orderBy(
    filteredResults,
    sortType,
    sortDirection ? "desc" : "asc"
  );

  const router = useRouter();

  const handleClick = (category) => {
    showDelete
      ? handleToggleDelete(
          category,
          "name",
          selectedObjects,
          setSelectedObjects
        )
      : router.push(`/categories/${category.id}`);
  };

  useEffect(() => {
    return () => {
      setFilter("");
    };
  }, [setFilter]);

  return (
    <>
      <div className="px-1.5 lg:px-3">
        {!view ? (
          <ThumbnailGrid>
            {filteredResults?.map((category) => {
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
      </div>
      {view === 2 && filteredResults?.length ? (
        <div className="lg:pl-1">
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
        </div>
      ) : null}
    </>
  );
};

export default AllCategories;
