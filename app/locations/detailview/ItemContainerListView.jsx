import { useState } from "react";
import {
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  GridLayout,
  SearchFilter,
} from "@/app/components";
import ItemCard from "./ItemCard";
import ColorCard from "./ColorCard";
import { v4 } from "uuid";
import { SingleCategoryIcon } from "@/app/assets";
import { getFilterCounts } from "@/app/lib/helpers";

const ItemContainerListView = ({ data, fetchKey, type, id }) => {
  const [filter, setFilter] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  let itemsToShow = {
    items: [...data?.items],
    containers: [...data?.containers],
  };

  if (showFavorites) {
    itemsToShow.items = itemsToShow?.items?.filter((i) => i.favorite);
    itemsToShow.containers = itemsToShow?.containers?.filter((c) => c.favorite);
  }

  if (filter) {
    itemsToShow.items = itemsToShow?.items?.filter((i) =>
      i.name?.toLowerCase().includes(filter.toLowerCase())
    );
    itemsToShow.containers = itemsToShow?.containers?.filter((c) =>
      c.name?.toLowerCase()?.includes(filter.toLowerCase())
    );
  }

  if (categoryFilters?.length) {
    itemsToShow.items = itemsToShow?.items?.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
    itemsToShow.containers = [];
  }

  const categoryFilterOptions = getFilterCounts(data?.items, "categories");

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  return (
    <>
      <div className="flex flex-wrap-reverse gap-2 items-center mb-4">
        {categoryFilterOptions?.length ? (
          <FilterButton
            filters={categoryFilters}
            setFilters={setCategoryFilters}
            options={categoryFilterOptions}
            label="Categories"
          />
        ) : null}
        <FavoriteFilterButton
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
        <SearchFilter
          filter={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter by name"
          size="md"
          padding=""
          classNames="max-md:w-full grow"
        />
      </div>

      <div className="flex gap-1 mb-3 flex-wrap">
        {categoryFilters?.map((category) => {
          return (
            <FilterPill
              key={v4()}
              onClose={onCategoryClose}
              item={category}
              icon={
                <SingleCategoryIcon width={12} fill={category.color?.hex} />
              }
            />
          );
        })}
        {showFavorites ? <FilterPill onClose={setShowFavorites} /> : null}
      </div>
      <GridLayout>
        {itemsToShow?.items?.map((item) => (
          <ItemCard
            item={item}
            key={`mainpage${item.name}`}
            data={data}
            fetchKey={fetchKey}
          />
        ))}
        {itemsToShow?.containers?.map((container) => {
          return (
            <ColorCard
              container={container}
              key={`mainpage${container.name}`}
              data={data}
              fetchKey={fetchKey}
            />
          );
        })}
      </GridLayout>
    </>
  );
};

export default ItemContainerListView;
