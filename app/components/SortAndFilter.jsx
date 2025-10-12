import { useContext } from "react";
import FilterModal from "./FilterModal";
import FilterPill from "./FilterPill";
import CardToggle from "./CardToggle";
import { LocationIcon, SearchIcon, SingleCategoryIcon } from "../assets";
import { FilterContext } from "../providers";
import { v4 } from "uuid";
import LucideIcon from "./LucideIcon";
import { ColorSwatch } from "@mantine/core";

const SortAndFilter = ({
  data,
  type,
  showLocationFilters,
  hideSortFilter,
  showItemSort,
}) => {
  const {
    categoryFilters,
    setCategoryFilters,
    locationFilters,
    setLocationFilters,
    showFavorites,
    setShowFavorites,
    colorFilters,
    setColorFilters,
    iconFilters,
    setIconFilters,
    filter,
    setFilter,
  } = useContext(FilterContext);

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const onLocationClose = (locId) => {
    setLocationFilters(
      locationFilters.filter((location) => location.id != locId)
    );
  };

  const onIconClose = (icon) => {
    setIconFilters(iconFilters.filter((i) => i != icon));
  };

  const onColorClose = (color) => {
    setColorFilters(colorFilters.filter((c) => c != color));
  };

  const handleClear = () => {
    setCategoryFilters([]);
    setLocationFilters([]);
    setIconFilters([]);
    setColorFilters([]);
    setShowFavorites(false);
    setFilter("");
  };

  return (
    <>
      <div className="flex w-full items-center justify-between mt-2">
        <CardToggle />
        {hideSortFilter ? null : (
          <FilterModal
            data={data}
            type={type}
            showLocationFilters={showLocationFilters}
            handleClear={handleClear}
            showItemSort={showItemSort}
          />
        )}
      </div>

      <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3">
        {hideSortFilter ? null : (
          <>
            {filter ? (
              <FilterPill
                item={{ name: filter }}
                icon={<SearchIcon classes="w-3 fill-black" />}
                onClose={() => setFilter("")}
              />
            ) : null}

            {showFavorites ? (
              <FilterPill onClose={() => setShowFavorites(false)} />
            ) : null}

            {categoryFilters?.map((category) => {
              return (
                <FilterPill
                  key={v4()}
                  item={category}
                  icon={
                    <SingleCategoryIcon width={12} fill={category.color?.hex} />
                  }
                  onClose={onCategoryClose}
                />
              );
            })}

            {locationFilters?.map((location) => {
              return (
                <FilterPill
                  key={v4()}
                  item={location}
                  onClose={() => onLocationClose(location?.id)}
                  icon={<LocationIcon width={10} showBottom={false} />}
                />
              );
            })}

            {iconFilters?.map((icon) => {
              return (
                <FilterPill
                  key={v4()}
                  item={{ name: " " }}
                  onClose={() => onIconClose(icon)}
                  icon={<LucideIcon iconName={icon} type="item" size={14} />}
                />
              );
            })}

            {colorFilters?.map((color) => {
              return (
                <FilterPill
                  key={v4()}
                  item={{ name: " " }}
                  onClose={() => onColorClose(color)}
                  icon={<ColorSwatch color={color} size={16} />}
                />
              );
            })}

            {categoryFilters
              ?.concat(locationFilters)
              ?.concat(iconFilters)
              ?.concat(colorFilters)?.length > 1 ||
            filter ||
            showFavorites ? (
              <button
                onClick={handleClear}
                className="rounded-full border border-black px-4 py-1 text-xs font-semibold hover:bg-black/80 active:bg-black/90 hover:text-white active:text-white"
              >
                Clear
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default SortAndFilter;
