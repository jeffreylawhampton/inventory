"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  CardToggle,
  ContextMenu,
  DeleteButtons,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  Header,
  ItemCardMasonry,
  ListViewCard,
  Loading,
  SearchFilter,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { LocationIcon, SingleCategoryIcon } from "../assets";
import NewItem from "./NewItem";
import {
  checkSelected,
  fetcher,
  getFilterCounts,
  handleToggleDelete,
  sortObjectArray,
} from "../lib/helpers";
import { Button } from "@mantine/core";
import { v4 } from "uuid";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";
import { handleDeleteMany, handleFavoriteClick } from "./handlers";
import { notify } from "../lib/handlers";
import { deleteObject } from "../lib/db";
import EditListItem from "./EditListItem";

const Page = ({ searchParams }) => {
  const query = searchParams?.query || "";
  const mutateKey = `/items/api?search=${query}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const { isMobile } = useContext(DeviceContext);
  const {
    categoryFilters,
    setCategoryFilters,
    filter,
    setFilter,
    locationFilters,
    setLocationFilters,
    showFavorites,
    setShowFavorites,
    view,
  } = useContext(FilterContext);
  const {
    setCurrentModal,
    open,
    close,
    showDelete,
    setShowDelete,
    handleCancel,
  } = useContext(ModalContext);
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);

  const router = useRouter();

  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

  const onCreateItem = () => {
    setCurrentModal({
      component: <NewItem data={data} close={close} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const onEditItem = (item) => {
    setCurrentModal({
      component: (
        <EditListItem
          data={data}
          item={item}
          mutateKey={mutateKey}
          close={close}
        />
      ),
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

  const categoryFilterArray = getFilterCounts(data, "categories");
  const locationFilterArray = getFilterCounts(data, "location");

  const locationArray = locationFilters?.map((location) => location);
  let itemsToShow = Array.isArray(data)
    ? sortObjectArray(data)?.filter(
        (item) =>
          item.name?.toLowerCase()?.includes(filter?.toLowerCase()) ||
          item.description?.toLowerCase()?.includes(filter?.toLowerCase()) ||
          item.purchasedAt?.toLowerCase()?.includes(filter?.toLowerCase())
      )
    : [];

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

  const handleFavorite = (item) => {
    return handleFavoriteClick({
      item,
      data,
      mutateKey,
    });
  };

  const handleClick = (item) => {
    showDelete
      ? handleToggleDelete(item, "name", selectedObjects, setSelectedObjects)
      : router.push(`/items/${item.id}`);
  };

  const handleListDeleteClick = async (item) => {
    if (confirm(`Delete ${item.name}?`)) {
      try {
        await mutate(
          mutateKey,
          deleteObject({ id: item.id, type: "item", navigate: false }),
          {
            optimisticData: itemsToShow?.filter((i) => i.id != item.id),
            revalidate: true,
            populateCache: false,
            rollbackOnError: true,
          }
        );
      } catch (e) {
        notify({ isError: true });
        throw new Error(e);
      }
    }
  };

  return (
    <div className="pb-64 lg:pb-32">
      <Header />
      <div className="px-1.5 lg:px-3">
        <h1 className="font-bold text-4xl pt-8 pb-4 ">Items</h1>
        <SearchFilter
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

            <FavoriteFilterButton label="Favorites" />
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
        {!view ? (
          <ThumbnailGrid>
            {sortObjectArray(itemsToShow)?.map((item) => {
              return (
                <ThumbnailCard
                  key={v4()}
                  item={item}
                  type="item"
                  path={`/items/${item.id}`}
                  showLocation
                  handleClick={handleClick}
                  isSelected={checkSelected(item, selectedObjects)}
                />
              );
            })}
          </ThumbnailGrid>
        ) : null}

        {view === 1 ? (
          <ItemCardMasonry>
            {sortObjectArray(itemsToShow)?.map((item) => {
              return (
                <SquareItemCard
                  key={item.name}
                  item={item}
                  showLocation
                  handleClick={handleClick}
                  handleFavoriteClick={handleFavorite}
                  isSelected={checkSelected(item, selectedObjects)}
                />
              );
            })}
          </ItemCardMasonry>
        ) : null}
      </div>
      {view === 2 ? (
        <div className="lg:px-1">
          {itemsToShow?.map((item) => {
            return (
              <ListViewCard
                key={item.name}
                item={item}
                data={data}
                handleFavoriteClick={handleFavorite}
                handleDeleteClick={handleListDeleteClick}
                handleEditClick={onEditItem}
                handleClick={handleClick}
                showLocation
                mutateKey={mutateKey}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}
        </div>
      ) : null}

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
              selectedObjects,
              setSelectedObjects,
              setShowDelete,
              data,
              mutateKey,
            })
          }
          count={selectedObjects?.length}
          type="items"
        />
      ) : null}
    </div>
  );
};

export default Page;
