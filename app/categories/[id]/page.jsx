"use client";
import { useState, useContext } from "react";
import { useUser } from "@/app/hooks/useUser";
import Link from "next/link";
import useSWR from "swr";
import {
  AddItems,
  CardToggle,
  ContextMenu,
  DeleteButtons,
  EditCategory,
  EmptyCard,
  Favorite,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  Header,
  ItemCardMasonry,
  Loading,
  PickerMenu,
  SearchFilter,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
  UpdateColor,
  UpdateIcon,
} from "@/app/components";
import { Button } from "@mantine/core";
import { DeviceContext } from "@/app/providers";
import {
  getFilterCounts,
  fetcher,
  handleToggleSelect,
  sortObjectArray,
} from "@/app/lib/helpers";
import CreateItem from "./CreateItem";
import { v4 } from "uuid";
import { handleFavoriteClick } from "@/app/lib/handlers";
import { ChevronRight } from "lucide-react";
import {
  handleDeleteSingle,
  handleItemFavoriteClick,
  handleRemove,
} from "../handlers";
import { CategoryIcon, ClosedBoxIcon, LocationIcon } from "@/app/assets";

const Page = ({ params: { id } }) => {
  const mutateKey = `/categories/api/${id}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const [filter, setFilter] = useState("");
  const [showRemove, setShowRemove] = useState(false);
  const [locationFilters, setLocationFilters] = useState([]);
  const [containerFilters, setContainerFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useUser();

  const { isSafari, isMobile, setCurrentModal, close, open, view } =
    useContext(DeviceContext);

  if (isLoading) return <Loading />;
  if (error) return <div>failed to load</div>;

  const handleSelect = (itemId) => {
    handleToggleSelect(itemId, selectedItems, setSelectedItems);
  };

  const handleCancel = () => {
    setShowRemove(false);
    setSelectedItems([]);
  };

  const handleClear = () => {
    setLocationFilters([]);
    setShowFavorites(false);
  };

  const onLocationClose = (id) => {
    setLocationFilters(locationFilters.filter((location) => location.id != id));
  };

  const onContainerClose = (id) => {
    setContainerFilters(
      containerFilters.filter((container) => container.id != id)
    );
  };

  const onEditCategory = () => {
    setCurrentModal({
      component: (
        <EditCategory data={data} close={close} mutateKey={mutateKey} />
      ),
      size: "lg",
    }),
      open();
  };

  const onCreateItem = () => {
    setCurrentModal({
      component: <CreateItem data={data} close={close} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    }),
      open();
  };

  const onAddItems = () => {
    setCurrentModal({
      component: (
        <AddItems
          pageData={data}
          type="category"
          close={close}
          mutateKey={mutateKey}
        />
      ),
      size: isMobile ? "xl" : "90%",
      title: `Add items to ${data?.name}`,
    });
    open();
  };

  const onUpdateColor = () => {
    setCurrentModal({
      component: (
        <UpdateColor
          data={data}
          close={close}
          mutateKey={mutateKey}
          type="category"
          additionalMutate="/categories/api"
        />
      ),
      size: "lg",
    }),
      open();
  };

  const onUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={data}
          close={close}
          mutateKey={mutateKey}
          type="category"
          additionalMutate="/categories/api"
        />
      ),
      size: "xl",
    }),
      open();
  };

  const updateColorClick = () => {
    setOpened(() => false);
    onUpdateColor();
  };

  const updateIconClick = () => {
    setOpened(() => false);
    onUpdateIcon();
  };

  const locationArray = locationFilters?.map((location) => location.id);
  const containerArray = containerFilters?.map((container) => container.id);

  let filteredResults = data?.items?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter?.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter?.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter?.toLowerCase())
  );

  if (locationFilters?.length) {
    filteredResults = filteredResults.filter((item) =>
      locationArray.includes(item.location?.id)
    );
  }

  if (containerFilters?.length) {
    filteredResults = filteredResults.filter((item) =>
      containerArray.includes(item.container?.id)
    );
  }

  if (showFavorites)
    filteredResults = filteredResults.filter((item) => item.favorite);

  const locationFilterOptions = getFilterCounts(data?.items, "location");
  const containerFilterOptions = getFilterCounts(data?.items, "container");

  return (
    <>
      <Header />
      <div className="flex gap-1 items-center pt-10 pb-4">
        <h1 className="font-bold text-2xl lg:text-4xl mr-2 flex gap-1 items-center">
          <Link
            className="text-primary-800 font-semibold [&>svg]:!fill-primary-700"
            href="/categories"
            prefetch={false}
          >
            <CategoryIcon
              width={isMobile ? 26 : 34}
              fill="!var(--mantine-color-primary-4)"
            />
          </Link>{" "}
          <ChevronRight size={20} /> {data?.name}
        </h1>

        <PickerMenu
          opened={opened}
          setOpened={setOpened}
          data={data}
          type="category"
          updateColorClick={updateColorClick}
          handleIconPickerClick={updateIconClick}
        />
        <Favorite
          item={data}
          onClick={() =>
            handleFavoriteClick({
              data,
              key: mutateKey,
              type: "category",
            })
          }
          size={isMobile ? 22 : 26}
          classes="ml-1.5"
        />
      </div>
      <SearchFilter
        label="Filter by name, description, or purchase location"
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {data?.items?.length ? (
        <>
          <div className="flex gap-1 lg:gap-2 mb-2 mt-1 flex-wrap">
            <CardToggle />
            <FilterButton
              filters={locationFilters}
              setFilters={setLocationFilters}
              label="Locations"
              options={locationFilterOptions}
            />
            <FilterButton
              filters={containerFilters}
              setFilters={setContainerFilters}
              label="Containers"
              options={containerFilterOptions}
            />
            <FavoriteFilterButton
              label="Favorites"
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
            />
          </div>
          <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3 ">
            {locationFilters?.map((location) => {
              return (
                <FilterPill
                  key={v4()}
                  onClose={onLocationClose}
                  item={location}
                  icon={<LocationIcon width={10} showBottom={false} />}
                />
              );
            })}

            {containerFilters?.map((container) => {
              return (
                <FilterPill
                  key={v4()}
                  onClose={onContainerClose}
                  item={container}
                  icon={<ClosedBoxIcon width={12} />}
                />
              );
            })}

            {showFavorites ? <FilterPill onClose={setShowFavorites} /> : null}

            {locationFilters?.length > 1 ? (
              <Button variant="subtle" onClick={handleClear} size="xs">
                Clear all
              </Button>
            ) : null}
          </div>
          {view ? (
            <ItemCardMasonry>
              {sortObjectArray(filteredResults)?.map((item) => {
                return (
                  <SquareItemCard
                    key={item.name}
                    item={item}
                    showLocation={true}
                    handleFavoriteClick={() =>
                      handleItemFavoriteClick({
                        item,
                        data,
                        mutateKey,
                      })
                    }
                    showDelete={showRemove}
                    isSelected={selectedItems?.includes(item.id)}
                    handleSelect={handleSelect}
                  />
                );
              })}
            </ItemCardMasonry>
          ) : (
            <ThumbnailGrid>
              {sortObjectArray(filteredResults)?.map((item) => {
                return (
                  <ThumbnailCard
                    item={item}
                    type="item"
                    key={item.id + item.name}
                    path={`/items/${item.id}`}
                    showLocation
                  />
                );
              })}
            </ThumbnailGrid>
          )}
        </>
      ) : (
        <EmptyCard
          move={onAddItems}
          add={onCreateItem}
          moveLabel={`Add existing items to ${data?.name}`}
          isCategory
        />
      )}
      <ContextMenu
        onAdd={onAddItems}
        onRemove={data?.items?.length ? () => setShowRemove(true) : null}
        type="category"
        onDelete={() => handleDeleteSingle({ data, isSafari, user })}
        onEdit={onEditCategory}
        onCreateItem={onCreateItem}
        addLabel={`Add items to ${data?.name}`}
        name={data?.name}
      />
      {showRemove ? (
        <DeleteButtons
          handleCancelItems={handleCancel}
          handleRemove={() =>
            handleRemove({
              data,
              mutateKey,
              setShowRemove,
              selectedItems,
              setSelectedItems,
            })
          }
          type="items"
          count={selectedItems?.length}
          isRemove
        />
      ) : null}
    </>
  );
};

export default Page;
