import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CardToggle,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  GridLayout,
  SearchFilter,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import ItemCard from "./ItemCard";
import ColorCard from "./ColorCard";
import { v4 } from "uuid";
import { SingleCategoryIcon } from "@/app/assets";
import { getFilterCounts, sortObjectArray } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/providers";
import { LocationContext } from "../layout";
import { handleContainerClick } from "../handlers";

const ItemContainerListView = ({ data, fetchKey }) => {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { view } = useContext(DeviceContext);
  const { openContainers, setOpenContainers, openLocations, setOpenLocations } =
    useContext(LocationContext);

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
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label="Filter by name"
        size="md"
        padding=""
        classNames="max-md:w-full grow"
      />
      <div className="flex flex-wrap-reverse gap-2 items-center mt-4 mb-2">
        <CardToggle />
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
      {!view ? (
        <ThumbnailGrid>
          {sortObjectArray(itemsToShow?.items)?.map((item) => (
            <ThumbnailCard
              key={v4()}
              item={item}
              type="item"
              path={`?type=item&id=${item.id}`}
            />
          ))}

          {sortObjectArray(itemsToShow?.containers)?.map((container) => (
            <ThumbnailCard
              key={v4()}
              item={container}
              type="container"
              path={`?type=container&id=${container.id}`}
              onClick={() =>
                handleContainerClick({
                  container,
                  openLocations,
                  setOpenLocations,
                  openContainers,
                  setOpenContainers,
                  router,
                })
              }
            />
          ))}
        </ThumbnailGrid>
      ) : (
        <GridLayout classes="pb-32 lg:pb-4">
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
      )}
    </>
  );
};

export default ItemContainerListView;
