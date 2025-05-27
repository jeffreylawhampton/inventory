"use client";
import { useState, useEffect, useContext } from "react";
import { useUser } from "@/app/hooks/useUser";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import {
  AddModal,
  ContextMenu,
  DeleteButtons,
  EmptyCard,
  Favorite,
  FavoriteFilterButton,
  FilterButton,
  IconPill,
  ItemCardMasonry,
  Loading,
  SearchFilter,
  SquareItemCard,
  Tooltip,
  UpdateColor,
} from "@/app/components";
import { Anchor, Breadcrumbs, Button, Pill } from "@mantine/core";
import { DeviceContext } from "@/app/layout";
import { deleteCategory, removeItems } from "../api/db";
import { breadcrumbStyles } from "@/app/lib/styles";
import { toggleFavorite } from "@/app/lib/db";
import EditCategory from "../EditCategory";
import { handleToggleSelect, sortObjectArray } from "@/app/lib/helpers";
import {
  IconChevronRight,
  IconTag,
  IconTags,
  IconHeart,
  IconMapPin,
} from "@tabler/icons-react";
import CreateItem from "./CreateItem";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import Header from "@/app/components/Header";

const fetcher = async (id) => {
  const res = await fetch(`/categories/api/${id}`);
  const data = await res.json();
  return data.category;
};

const Page = ({ params: { id } }) => {
  const { data, isLoading, error, mutate } = useSWR(`categories${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [showRemove, setShowRemove] = useState(false);
  const [locationFilters, setLocationFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [opened, { open, close }] = useDisclosure();
  const { user } = useUser();

  const { isSafari, setCrumbs } = useContext(DeviceContext);

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
            <IconTag size={breadcrumbStyles.iconSize} aria-label="Tag" />

            {data?.name}
          </span>
        </Breadcrumbs>
      ) : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <div>failed to load</div>;

  // const handleSelect = (itemId) => {
  //   setSelectedItems(
  //     selectedItems?.includes(itemId)
  //       ? selectedItems.filter((i) => i != itemId)
  //       : [...selectedItems, itemId]
  //   );
  // };

  const handleSelect = (itemId) => {
    handleToggleSelect(itemId, selectedItems, setSelectedItems);
  };

  const handleCancel = () => {
    setShowRemove(false);
    setSelectedItems([]);
  };

  const handleRemove = async () => {
    const duplicate = { ...data };

    duplicate.items = duplicate.items.filter(
      (item) => !selectedItems?.includes(item.id)
    );
    duplicate.items = sortObjectArray(duplicate.items);

    try {
      await mutate(
        removeItems({
          id,
          items: selectedItems,
        }),
        {
          optimisticData: duplicate,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );

      toast.success(
        `Removed ${selectedItems.length} ${
          selectedItems.length === 1 ? "item" : "items"
        } from ${data.name}`
      );

      setShowRemove(false);
      setSelectedItems([]);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;
    try {
      await mutate(
        `categories${id}`,
        toggleFavorite({ type: "category", id: data.id, add }),
        {
          optimisticData: {
            ...data,
            favorite: add,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleItemFavoriteClick = async (item) => {
    const add = !item.favorite;
    const itemArray = [...data.items];
    const itemToUpdate = itemArray.find((i) => i.name === item.name);
    itemToUpdate.favorite = !item.favorite;

    try {
      await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
        optimisticData: {
          ...data,
          itemArray,
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  const handleDelete = async () => {
    if (
      !isSafari &&
      !confirm(`Are you sure you want to delete ${data?.name || "this item"}`)
    )
      return;
    try {
      await mutate("categories", deleteCategory({ id }), {
        optimisticData: sortObjectArray(user?.categories)?.filter(
          (category) => category.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(`Successfully deleted ${data?.name}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const handleClear = () => {
    setLocationFilters([]);
    setShowFavorites(false);
  };

  const onLocationClose = (id) => {
    setLocationFilters(locationFilters.filter((location) => location.id != id));
  };

  const locationArray = locationFilters?.map((location) => location.id);

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

  if (showFavorites)
    filteredResults = filteredResults.filter((item) => item.favorite);

  return (
    <>
      <Header />
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-bold text-4xl flex gap-2 items-center">
          {data?.name}
        </h1>

        <UpdateColor
          data={data}
          type="category"
          mutateKey={`categories${id}`}
        />

        <Favorite
          item={data}
          onClick={handleFavoriteClick}
          position=""
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
              type="locations"
              countItem=""
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
                <Pill
                  key={v4()}
                  withRemoveButton
                  onRemove={() => onLocationClose(location.id)}
                  size="sm"
                  classNames={{
                    label: "font-semibold lg:p-1 flex gap-[2px] items-center",
                  }}
                  styles={{
                    root: {
                      height: "fit-content",
                    },
                  }}
                >
                  <IconMapPin aria-label="Category" size={16} />
                  {location?.name}
                </Pill>
              );
            })}

            {showFavorites ? (
              <Pill
                key={v4()}
                withRemoveButton
                onRemove={() => setShowFavorites(false)}
                size="sm"
                classNames={{
                  label: "font-semibold lg:p-1 flex gap-[2px] items-center",
                }}
                styles={{
                  root: {
                    height: "fit-content",
                  },
                }}
              >
                <IconHeart aria-label="Favorites" size={16} />
                Favorites
              </Pill>
            ) : null}

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
                  handleFavoriteClick={handleItemFavoriteClick}
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

      <EditCategory
        data={data}
        id={id}
        opened={opened}
        close={close}
        user={user}
      />

      <ContextMenu
        onAdd={() => setShowItemModal(true)}
        onRemove={data?.items?.length ? () => setShowRemove(true) : null}
        type="category"
        onDelete={handleDelete}
        onEdit={open}
        onCreateItem={() => setShowCreateItem(true)}
        addLabel={`Add items to ${data.name}`}
      />

      {showRemove ? (
        <DeleteButtons
          handleCancel={handleCancel}
          handleRemove={handleRemove}
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

      {showCreateItem ? (
        <CreateItem
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          data={data}
        />
      ) : null}
    </>
  );
};

export default Page;
