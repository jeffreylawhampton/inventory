"use client";
import { useState } from "react";
import { deleteLocation } from "../api/db";
import { toggleFavorite } from "@/app/lib/db";
import toast from "react-hot-toast";
import EditLocation from "../EditLocation";
import useSWR from "swr";
import { useUser } from "@/app/hooks/useUser";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import SearchFilter from "@/app/components/SearchFilter";
import { useDisclosure } from "@mantine/hooks";
import { Anchor, Breadcrumbs } from "@mantine/core";
import Loading from "@/app/components/Loading";
import ViewToggle from "@/app/components/ViewToggle";
import Nested from "./Nested";
import AllContainers from "./AllContainers";
import AllItems from "./AllItems";
import { breadcrumbStyles } from "@/app/lib/styles";
import {
  IconChevronRight,
  IconMapPin,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import CreateItem from "./CreateItem";
import CreateContainer from "./CreateContainer";

const fetcher = async (id) => {
  const res = await fetch(`/locations/api/${id}`);
  const data = await res.json();
  return data.location;
};

const Page = ({ params: { id } }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showCreateContainer, setShowCreateContainer] = useState(false);
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [view, setView] = useState(0);
  const { user } = useUser();
  const { data, error, isLoading, mutate } = useSWR(`location${id}`, () =>
    fetcher(id)
  );

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

  const handleItemFavoriteClick = async ({ item }) => {
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
  };

  const handleContainerFavoriteClick = async (container) => {
    const add = !container.favorite;

    const containerArray = [...data.containers];
    const containerToUpdate = containerArray.find(
      (i) => i.name === container.name
    );
    containerToUpdate.favorite = add;

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
      <Breadcrumbs
        separatorMargin={6}
        separator={
          <IconChevronRight
            size={breadcrumbStyles.separatorSize}
            className={breadcrumbStyles.separatorClasses}
            strokeWidth={breadcrumbStyles.separatorStroke}
          />
        }
        classNames={breadcrumbStyles.breadCrumbClasses}
      >
        <Anchor href={"/locations"}>
          <IconMapPin
            size={24}
            aria-label="Locations"
            className={breadcrumbStyles.iconColor}
          />{" "}
          All locations
        </Anchor>
        <span>
          {" "}
          <IconMapPin size={20} aria-label="Locations" /> {data?.name}
        </span>
      </Breadcrumbs>
      <div className="flex gap-2 items-center pb-4">
        <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
          {data?.name}{" "}
          <div onClick={handleFavoriteClick} className="mt-[3px]">
            {data?.favorite ? (
              <IconHeartFilled className="text-danger-400" />
            ) : (
              <IconHeart className="text-bluegray-500 hover:text-danger-200" />
            )}
          </div>
        </h1>
      </div>
      <ViewToggle
        active={view}
        setActive={setView}
        data={["Nested", "All items", "All containers"]}
      />
      {view != 0 && (
        <SearchFilter
          label={`Search for an ${view === 1 ? "item" : "container"}`}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
      )}
      {view === 0 ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={handleAdd}
          mutate={mutate}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
        />
      ) : null}

      {view === 1 ? (
        <AllItems
          data={data}
          filter={filter}
          handleAdd={handleAdd}
          handleItemFavoriteClick={handleItemFavoriteClick}
        />
      ) : null}

      {view === 2 ? (
        <AllContainers
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          data={data}
          filter={filter}
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
