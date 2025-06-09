"use client";
import { useState, useEffect, useContext } from "react";
import { useUser } from "@/app/hooks/useUser";
import useSWR from "swr";
import {
  AddModal,
  ContextMenu,
  DeleteButtons,
  EmptyCard,
  Favorite,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  IconPill,
  ItemCardMasonry,
  Loading,
  SearchFilter,
  SquareItemCard,
  UpdateColor,
} from "@/app/components";
import { Anchor, Breadcrumbs, Button } from "@mantine/core";
import { DeviceContext } from "@/app/layout";
import { breadcrumbStyles } from "@/app/lib/styles";
import EditCategory from "../../components/forms/EditCategory";
import {
  handleToggleSelect,
  sortObjectArray,
  getFilterCounts,
} from "@/app/lib/helpers";
import { IconChevronRight, IconTag, IconTags } from "@tabler/icons-react";
import CreateItem from "./CreateItem";
import { v4 } from "uuid";
import Header from "@/app/components/Header";
import { handleFavoriteClick } from "@/app/lib/handlers";
import {
  handleDeleteSingle,
  handleItemFavoriteClick,
  handleRemove,
} from "../handlers";
import { ClosedBoxIcon, LocationIcon } from "@/app/assets";
import { fetcher } from "@/app/lib/fetcher";

const Page = ({ params: { id } }) => {
  const mutateKey = `/categories/api/${id}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const [filter, setFilter] = useState("");
  const [showRemove, setShowRemove] = useState(false);
  const [locationFilters, setLocationFilters] = useState([]);
  const [containerFilters, setContainerFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useUser();

  const { isSafari, isMobile, setCrumbs, setCurrentModal, close, open } =
    useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(
      data?.name ? (
        <Breadcrumbs
          separatorMargin={6}
          separator={
            <IconChevronRight
              size={breadcrumbStyles.separatorSize}
              className={breadcrumbStyles.separatorClasses}
              strokeWidth={breadcrumbStyles.separatorStroke}
              separatorMargin={breadcrumbStyles.separatorMargin}
            />
          }
          classNames={breadcrumbStyles.breadCrumbClasses}
        >
          <Anchor href={`/categories`} classNames={{ root: "!no-underline" }}>
            <IconPill
              icon={
                <IconTags aria-label="Tag" size={breadcrumbStyles.iconSize} />
              }
              name="All categories"
              labelClasses={breadcrumbStyles.textSize}
              padding={breadcrumbStyles.padding}
            />
          </Anchor>

          <span className={breadcrumbStyles.textSize}>
            <IconTag
              size={breadcrumbStyles.iconSize}
              aria-label="Tag"
              fill={data?.color?.hex ?? "white"}
            />

            {data?.name}
          </span>
        </Breadcrumbs>
      ) : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-bold text-4xl flex gap-2 items-center">
          {data?.name}
        </h1>

        <UpdateColor data={data} type="category" mutateKey={mutateKey} />

        <Favorite
          item={data}
          onClick={() =>
            handleFavoriteClick({
              data,
              key: mutateKey,
              type: "category",
            })
          }
          size={26}
        />
      </div>

      <SearchFilter
        label="Filter by name, description, or purchase location"
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {data?.items?.length ? (
        <>
          <div className="flex gap-1 lg:gap-2 mb-2 mt-1 ">
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
        </>
      ) : (
        <EmptyCard
          move={() => setShowItemModal(true)}
          add={() => setShowCreateItem(true)}
          moveLabel={`Add existing items to ${data.name}`}
          isCategory
        />
      )}

      <ContextMenu
        onAdd={() => setShowItemModal(true)}
        onRemove={data?.items?.length ? () => setShowRemove(true) : null}
        type="category"
        onDelete={() => handleDeleteSingle({ data, isSafari, user })}
        onEdit={onEditCategory}
        onCreateItem={onCreateItem}
        addLabel={`Add items to ${data.name}`}
        name={data?.name}
      />

      {showRemove ? (
        <DeleteButtons
          handleCancel={handleCancel}
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

      {showItemModal ? (
        <AddModal
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
          itemList={data?.items}
          type="category"
          name={data.name}
        />
      ) : null}

      {/* {showCreateItem ? (
        <CreateItem
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          data={data}
        />
      ) : null} */}
    </>
  );
};

export default Page;
