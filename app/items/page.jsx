"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import {
  CategoryPill,
  ContextMenu,
  DeleteButtons,
  FavoriteFilterButton,
  FilterButton,
  ItemCardMasonry,
  Loading,
  SearchFilter,
  SquareItemCard,
} from "@/app/components";
import NewItem from "./NewItem";
import { fetcher } from "../lib/fetcher";
import { sortObjectArray } from "../lib/helpers";
import { Button, Pill } from "@mantine/core";
import { v4 } from "uuid";
import { IconMapPin, IconHeart } from "@tabler/icons-react";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import { DeviceContext } from "../layout";
import LocationFilterButton from "../components/LocationFilterButton";
import CategoryFilterButton from "../components/CategoryFilterButton";
import { deleteMany } from "./api/db";

const Page = ({ searchParams }) => {
  const [filter, setFilter] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const query = searchParams?.query || "";
  const { data, isLoading, error, mutate } = useSWR(
    `/items/api?search=${query}`,
    fetcher
  );
  const { setCrumbs } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(null);
  }, []);
  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const onLocationClose = (loc) => {
    setLocationFilters(locationFilters.filter((location) => location != loc));
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

  const handleSelect = (item) => {
    setSelectedItems(
      selectedItems?.includes(item)
        ? selectedItems.filter((i) => i != item)
        : [...selectedItems, item]
    );
  };

  const handleDelete = async () => {
    try {
      await mutate(deleteMany(selectedItems));
      setShowDelete(false);
      toast.success(
        `Deleted ${selectedItems?.length} ${
          selectedItems?.length === 1 ? "item" : "items"
        }`
      );
      setSelectedItems([]);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const handleFavoriteClick = async (item) => {
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

  const locationArray = locationFilters?.map((location) => location);
  let itemsToShow = data?.items?.filter(
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
      locationArray.includes(item.location?.name)
    );

    if (locationFilters?.includes("undefined")) {
      itemsToShow = itemsToShow.concat(
        data?.items?.filter((i) => !i.locationId)
      );
    }
  }

  if (showFavorites) {
    itemsToShow = itemsToShow?.filter((item) => item.favorite);
  }

  return (
    <div className="pb-8 mt-[-1.5rem]">
      <h1 className="font-bold text-3xl pb-6">Items</h1>
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label="Filter by name, description, or purchase location"
      />
      <div className="flex gap-1 lg:gap-2 mb-2 mt-1 ">
        <CategoryFilterButton
          filters={categoryFilters}
          setFilters={setCategoryFilters}
          label="Categories"
          type="categories"
        />
        {/* <FilterButton
          filters={categoryFilters}
          setFilters={setCategoryFilters}
          label="Categories"
          type="categories"
        /> */}

        <LocationFilterButton
          label="Locations"
          data={data}
          filters={locationFilters}
          setFilters={setLocationFilters}
        />

        {/* <FilterButton
          filters={locationFilters}
          setFilters={setLocationFilters}
          label="Locations"
          type="locations"
        /> */}

        <FavoriteFilterButton
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          label="Favorites"
        />
      </div>
      <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3 ">
        {categoryFilters?.map((category) => {
          return (
            <CategoryPill
              key={v4()}
              removable
              category={category}
              isCloseable={true}
              onClose={() => onCategoryClose(category.id)}
              size="sm"
              showTag
              link={false}
            />
          );
        })}

        {locationFilters?.map((location) => {
          return (
            <Pill
              key={v4()}
              withRemoveButton
              onRemove={() => onLocationClose(location)}
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
              {location === "undefined" ? "No location" : location}
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

        {categoryFilters?.concat(locationFilters)?.length > 1 ? (
          <Button variant="subtle" onClick={handleClear} size="xs">
            Clear all
          </Button>
        ) : null}
      </div>

      <ItemCardMasonry>
        {sortObjectArray(itemsToShow)?.map((item) => {
          return (
            <SquareItemCard
              key={item.name}
              item={item}
              showLocation
              handleFavoriteClick={handleFavoriteClick}
              handleSelect={handleSelect}
              isSelected={selectedItems?.includes(item.id)}
              showDelete={showDelete}
            />
          );
        })}
      </ItemCardMasonry>

      <NewItem data={data} opened={opened} close={close} />
      {/* <CreateButton tooltipText="Create new item" onClick={open} /> */}

      <ContextMenu
        onDelete={() => setShowDelete(true)}
        onCreateItem={open}
        type="items"
        showRemove={false}
      />

      {showDelete ? (
        <DeleteButtons
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          count={selectedItems?.length}
          type="items"
        />
      ) : null}
    </div>
  );
};

export default Page;
