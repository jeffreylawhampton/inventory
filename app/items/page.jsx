"use client";
import { useState, useContext } from "react";
import useSWR from "swr";
import {
  CardToggle,
  ContextMenu,
  DeleteButtons,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  ItemCardMasonry,
  Loading,
  SearchFilter,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { LocationIcon, SingleCategoryIcon } from "../assets";
import NewItem from "./NewItem";
import {
  fetcher,
  getFilterCounts,
  handleToggleSelect,
  sortObjectArray,
} from "../lib/helpers";
import { Button } from "@mantine/core";
import { v4 } from "uuid";
import { DeviceContext } from "../providers";
import { handleDeleteMany, handleFavoriteClick } from "./handlers";

const Page = ({ searchParams }) => {
  const [filter, setFilter] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const query = searchParams?.query || "";
  const mutateKey = `/items/api?search=${query}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const { setCurrentModal, open, close, isMobile, view, setView } =
    useContext(DeviceContext);

  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

  const onCreateItem = () => {
    setCurrentModal({
      component: <NewItem data={data} close={close} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const onLocationClose = (locId) => {
    setLocationFilters(
      locationFilters.filter((location) => location.id != locId)
    );
  };

  const handleClear = () => {
    setCategoryFilters([]);
    setLocationFilters([]);
    setShowFavorites(false);
  };

  const handleCancel = () => {
    setSelectedItems([]);
    setShowDelete(false);
  };

  const categoryFilterArray = getFilterCounts(data, "categories");
  const locationFilterArray = getFilterCounts(data, "location");

  const locationArray = locationFilters?.map((location) => location);
  let itemsToShow = data?.filter(
    (item) =>
      item.name?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.description?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.purchasedAt?.toLowerCase()?.includes(filter?.toLowerCase())
  );

  if (categoryFilters?.length) {
    itemsToShow = itemsToShow.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
  }

  if (locationFilters?.length) {
    itemsToShow = itemsToShow.filter((item) =>
      locationArray.find((l) => l.name === item.location?.name)
    );

    if (locationFilters?.includes("undefined")) {
      itemsToShow = itemsToShow.concat(data?.filter((i) => !i.locationId));
    }
  }

  if (showFavorites) {
    itemsToShow = itemsToShow?.filter((item) => item.favorite);
  }

  return (
    <div className="pb-32 lg:pb-8 ">
      <h1 className="font-bold text-4xl pt-8 pb-4 ">Items</h1>
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label="Filter by name, description, or purchase location"
      />
      <div className="flex flex-wrap-reverse gap-3">
        <CardToggle />
        <div className="flex gap-1 lg:gap-2 ">
          <FilterButton
            filters={categoryFilters}
            setFilters={setCategoryFilters}
            label="Categories"
            options={categoryFilterArray}
          />

          <FilterButton
            filters={locationFilters}
            setFilters={setLocationFilters}
            label="Locations"
            options={locationFilterArray}
          />

          <FavoriteFilterButton
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            label="Favorites"
          />
        </div>
      </div>
      <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3 ">
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
              onClose={onLocationClose}
              icon={<LocationIcon width={10} showBottom={false} />}
            />
          );
        })}

        {categoryFilters?.concat(locationFilters)?.length > 1 ? (
          <Button variant="subtle" onClick={handleClear} size="xs">
            Clear all
          </Button>
        ) : null}
      </div>
      {view ? (
        <ItemCardMasonry>
          {sortObjectArray(itemsToShow)?.map((item) => {
            return (
              <SquareItemCard
                key={item.name}
                item={item}
                showLocation
                handleFavoriteClick={() =>
                  handleFavoriteClick({
                    item,
                    data,
                    mutateKey,
                  })
                }
                handleSelect={() =>
                  handleToggleSelect(item.id, selectedItems, setSelectedItems)
                }
                isSelected={selectedItems?.includes(item.id)}
                showDelete={showDelete}
              />
            );
          })}
        </ItemCardMasonry>
      ) : (
        <ThumbnailGrid>
          {sortObjectArray(itemsToShow)?.map((item) => {
            return (
              <ThumbnailCard
                key={v4()}
                item={item}
                type="item"
                path={`/items/${item.id}`}
                showLocation
                showDelete={showDelete}
                handleSelect={() =>
                  handleToggleSelect(item.id, selectedItems, setSelectedItems)
                }
                isSelected={selectedItems?.includes(item.id)}
              />
            );
          })}
        </ThumbnailGrid>
      )}

      <ContextMenu
        onDelete={() => setShowDelete(true)}
        onCreateItem={onCreateItem}
        type="items"
        showRemove={false}
      />

      {showDelete ? (
        <DeleteButtons
          handleCancelItems={handleCancel}
          handleDeleteItems={() =>
            handleDeleteMany({
              selectedItems,
              setSelectedItems,
              setShowDelete,
              data,
              mutateKey,
            })
          }
          count={selectedItems?.length}
          type="items"
        />
      ) : null}
    </div>
  );
};

export default Page;
