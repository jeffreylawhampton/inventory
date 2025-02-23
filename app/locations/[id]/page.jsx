"use client";
import { useState, useContext, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import {
  AddRemoveModal,
  ContextMenu,
  Favorite,
  FavoriteFilterButton,
  IconPill,
  Loading,
  SearchFilter,
  ViewToggle,
} from "@/app/components";
import { deleteLocation } from "../api/db";
import { toggleFavorite } from "@/app/lib/db";
import toast from "react-hot-toast";
import EditLocation from "./EditLocation";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import { Anchor, Breadcrumbs } from "@mantine/core";
import Nested from "./Nested";
import AllContainers from "./AllContainers";
import AllItems from "./AllItems";
import { breadcrumbStyles } from "@/app/lib/styles";
import { IconChevronRight, IconMapPin, IconBox } from "@tabler/icons-react";
import CreateItem from "./CreateItem";
import CreateContainer from "./CreateContainer";
import { DeviceContext } from "@/app/layout";

const fetcher = async (id) => {
  const res = await fetch(`/locations/api/${id}`);
  const data = await res.json();
  return data.location;
};

const Page = ({ params: { id } }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCreateContainer, setShowCreateContainer] = useState(false);
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [view, setView] = useState(0);
  const [items, setItems] = useState([]);
  const { user } = useUser();
  const { data, error, isLoading, mutate } = useSWR(`location${id}`, () =>
    fetcher(id)
  );

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
          <Anchor href={`/locations`} classNames={{ root: "!no-underline" }}>
            <IconPill
              icon={
                <IconMapPin
                  aria-label="Location"
                  size={breadcrumbStyles.iconSize}
                />
              }
              name="All locations"
              labelClasses={breadcrumbStyles.textSize}
              padding={breadcrumbStyles.padding}
            />
          </Anchor>

          <span className={breadcrumbStyles.textSize}>
            <IconMapPin
              size={breadcrumbStyles.iconSize}
              aria-label="Location"
            />

            {data?.name}
          </span>
        </Breadcrumbs>
      ) : null
    );
  }, [data]);

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;
    try {
      await mutate(toggleFavorite({ type: "location", id: data.id, add }), {
        optimisticData: {
          ...data,
          favorite: add,
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
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
    const updated = { ...data };
    let itemToUpdate;
    if (!item.containerId) {
      itemToUpdate = updated.items.find((i) => i.id === item.id);
    } else {
      const itemContainer = data.containers?.find(
        (con) => con.id === item.containerId
      );
      itemToUpdate = itemContainer.items.find((i) => i.id === item.id);
    }
    itemToUpdate.favorite = add;

    try {
      if (
        await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        })
      ) {
        setItems();
        return toast.success(
          add
            ? `Added ${item.name} to favorites`
            : `Removed ${item.name} from favorites`
        );
      }
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleContainerFavoriteClick = async (container) => {
    const add = !container?.favorite;

    const containerArray = [...data.containers];
    const containerToUpdate = containerArray.find(
      (i) => i.name === container.name
    );
    if (containerToUpdate) containerToUpdate.favorite = add;

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: {
            ...data,
            containerArray,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleDelete = async () => {
    if (
      !isSafari &&
      !confirm(
        `Are you sure you want to delete ${data?.name || "this location"}?`
      )
    )
      return;
    try {
      await mutate("locations", deleteLocation({ id }), {
        optimisticData: user?.locations?.filter(
          (location) => location.id != id
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

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-semibold text-3xl  flex gap-2 items-center">
          {data?.name}
        </h1>
        <Favorite
          position=""
          onClick={handleFavoriteClick}
          item={data}
          size={28}
        />
      </div>
      <ViewToggle
        active={view}
        setActive={setView}
        data={["Nested", "All containers", "All items"]}
      />
      {view != 0 && (
        <div className="mb-3">
          <SearchFilter
            label={`Search for ${view === 1 ? "a container" : "an item"}`}
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
          <FavoriteFilterButton
            label="Favorites"
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
          />
        </div>
      )}
      {view === 0 ? (
        <Nested
          data={data}
          items={items}
          setItems={setItems}
          filter={filter}
          handleAdd={handleAdd}
          mutate={mutate}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          setShowCreateContainer={setShowCreateContainer}
          setShowCreateItem={setShowCreateItem}
        />
      ) : null}

      {view === 1 ? (
        <AllContainers
          showFavorites={showFavorites}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          data={data}
          filter={filter}
          showCreateContainer={showCreateContainer}
          setShowCreateContainer={setShowCreateContainer}
        />
      ) : null}

      {view === 2 ? (
        <AllItems
          data={data}
          filter={filter}
          showFavorites={showFavorites}
          handleAdd={handleAdd}
          handleItemFavoriteClick={handleItemFavoriteClick}
          setShowCreateItem={setShowCreateItem}
        />
      ) : null}

      <EditLocation
        data={data}
        id={id}
        opened={opened}
        open={open}
        close={close}
      />

      <ContextMenu
        type="location"
        onDelete={handleDelete}
        onEdit={open}
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
        onCreateItem={() => setShowCreateItem(true)}
        onCreateContainer={() => setShowCreateContainer(true)}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        isRemove={isRemove}
        itemList={data?.items}
        type="location"
        name={data?.name}
      />

      {showCreateItem ? (
        <CreateItem
          data={data}
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          mutate={mutate}
        />
      ) : null}

      {showCreateContainer ? (
        <CreateContainer
          data={data}
          showCreateContainer={showCreateContainer}
          setShowCreateContainer={setShowCreateContainer}
          mutate={mutate}
        />
      ) : null}
    </>
  );
};

export default Page;
