"use client";
import { useState, useEffect, useContext } from "react";
import { useUser } from "@/app/hooks/useUser";
import useSWR, { mutate } from "swr";
import { useDisclosure } from "@mantine/hooks";
import {
  AddRemoveModal,
  ContextMenu,
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
import { Anchor, Breadcrumbs, Button, ColorSwatch, Pill } from "@mantine/core";
import { DeviceContext } from "@/app/layout";
import { deleteCategory, updateCategory } from "../api/db";
import { breadcrumbStyles } from "@/app/lib/styles";
import { toggleFavorite } from "@/app/lib/db";
import EditCategory from "../EditCategory";
import { sortObjectArray } from "@/app/lib/helpers";
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

const fetcher = async (id) => {
  const res = await fetch(`/categories/api/${id}`);
  const data = await res.json();
  return data.category;
};

const Page = ({ params: { id } }) => {
  const { data, isLoading, error } = useSWR(`categories${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [locationFilters, setLocationFilters] = useState([]);
  const [color, setColor] = useState(data?.color?.hex);
  const [showPicker, setShowPicker] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const { user } = useUser();

  const { isSafari, setCrumbs } = useContext(DeviceContext);

  useEffect(() => {
    setColor(data?.color?.hex);
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
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <div>failed to load</div>;

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        `categories${id}`,
        updateCategory({
          id: data.id,
          name: data.name,
          color: { hex: color },
          userId: data.userId,
        }),
        {
          optimisticData: { ...data, color: { hex: color } },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Color updated");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowPicker(false);
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
      await mutate(
        `categories${id}`,
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: {
            ...data,
            itemArray,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
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
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-semibold text-3xl  flex gap-2 items-center">
          {data?.name}
        </h1>

        <Tooltip
          label="Update color"
          textClasses={showPicker ? "hidden" : "!text-black font-medium"}
        >
          <ColorSwatch
            color={color}
            size={22}
            onClick={() => setShowPicker(!showPicker)}
            className="cursor-pointer"
          />
        </Tooltip>

        {showPicker ? (
          <UpdateColor
            data={data}
            handleSetColor={handleSetColor}
            color={color}
            colors={user?.colors?.map((color) => color.hex)}
            setColor={setColor}
            setShowPicker={setShowPicker}
          />
        ) : null}

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
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
        type="category"
        onDelete={handleDelete}
        onEdit={open}
        onCreateItem={() => setShowCreateItem(true)}
      />

      {showItemModal ? (
        <AddRemoveModal
          isRemove={isRemove}
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
