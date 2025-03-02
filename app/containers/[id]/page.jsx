"use client";
import { useState, useEffect, useContext } from "react";
import { useUserColors } from "@/app/hooks/useUserColors";
import { useDisclosure } from "@mantine/hooks";
import useSWR from "swr";
import {
  AddModal,
  ContextMenu,
  Favorite,
  FavoriteFilterButton,
  IconPill,
  Loading,
  LocationCrumbs,
  SearchFilter,
  Tooltip,
  UpdateColor,
  ViewToggle,
} from "@/app/components";
import { updateContainerColor, deleteContainer } from "../api/db";
import { toggleFavorite } from "@/app/lib/db";
import toast from "react-hot-toast";
import EditContainer from "./EditContainer";
import Nested from "./Nested";
import { Anchor, Breadcrumbs, ColorSwatch } from "@mantine/core";
import { IconBox, IconChevronRight } from "@tabler/icons-react";
import { breadcrumbStyles } from "@/app/lib/styles";
import CreateItem from "./CreateItem";
import NewContainer from "../NewContainer";
import { sortObjectArray, unflattenArray } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/layout";
import AllContents from "./AllContents";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const { data, error, isLoading, mutate } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showCreateContainer, setShowCreateContainer] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [color, setColor] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [view, setView] = useState(0);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const { isSafari, setCrumbs } = useContext(DeviceContext);
  const [opened, { open, close }] = useDisclosure();
  const { colors } = useUserColors();

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;

    try {
      await mutate(toggleFavorite({ type: "container", id: data.id, add }), {
        optimisticData: { ...data, favorite: add },
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

  const handleContainerFavoriteClick = async (container) => {
    const add = !container.favorite;
    let optimisticData = { ...data };
    const containerToUpdate = optimisticData?.containerArray?.find(
      (con) => con.name === container.name
    );
    containerToUpdate.favorite = add;

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: optimisticData,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      setResults(
        sortObjectArray(unflattenArray(optimisticData?.containerArray, data.id))
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

  const handleItemFavoriteClick = async (item) => {
    const add = !item.favorite;
    const updated = { ...data };

    if (item.containerId === data.id) {
      const itemToUpdate = updated.items.find((i) => i.id === item.id);
      itemToUpdate.favorite = add;
    } else {
      const itemContainer = data.containerArray?.find(
        (con) => con.id === item.containerId
      );
      const itemToUpdate = itemContainer.items.find((i) => i.id === item.id);
      itemToUpdate.favorite = add;
    }

    try {
      await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
        optimisticData: updated,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      setResults(
        sortObjectArray(unflattenArray(updated?.containerArray, data.id))
      );
      return toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
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
        `Are you sure you want to delete ${data?.name || "this container"}?`
      )
    )
      return;
    try {
      await mutate(deleteContainer({ id }));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        updateContainerColor({
          id: data.id,
          color,
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

  useEffect(() => {
    setColor(data?.color?.hex);
    setItems(sortObjectArray(data?.items));

    const ancestors = [];
    const getAncestors = (container) => {
      if (container?.parentContainerId) {
        ancestors.unshift(container.parentContainer);
        if (container?.parentContainer?.parentContainerId) {
          getAncestors(container.parentContainer);
        }
      }
    };
    getAncestors(data);
    setCrumbs(
      data?.location?.id || ancestors?.length ? (
        <LocationCrumbs
          name={data?.name}
          location={data?.location}
          ancestors={ancestors}
          type="container"
        />
      ) : data?.name ? (
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
          <Anchor href={`/containers`} classNames={{ root: "!no-underline" }}>
            <IconPill
              icon={
                <IconBox
                  aria-label="Container"
                  size={breadcrumbStyles.iconSize}
                />
              }
              name="All containers"
              labelClasses={breadcrumbStyles.textSize}
              padding={breadcrumbStyles.padding}
            />
          </Anchor>

          <span className={breadcrumbStyles.textSize}>
            <IconBox size={breadcrumbStyles.iconSize} aria-label="Container" />

            {data?.name}
          </span>
        </Breadcrumbs>
      ) : null
    );
  }, [data]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-bold text-4xl">{data?.name}</h1>
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
            colors={colors}
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

      <ViewToggle active={view} setActive={setView} data={["Nested", "All"]} />

      {view ? (
        <div className="mb-3">
          <SearchFilter
            label="Filter by name, description, or purchase location"
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
          {data?.items?.length ? (
            <FavoriteFilterButton
              label="Favorites"
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
            />
          ) : null}
        </div>
      ) : null}

      {!view ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={handleAdd}
          setShowCreateContainer={setShowCreateContainer}
          setShowCreateItem={setShowCreateItem}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleItemFavoriteClick={handleItemFavoriteClick}
          mutate={mutate}
          items={items}
          setItems={setItems}
          results={results}
          setResults={setResults}
          id={id}
        />
      ) : (
        <AllContents
          filter={filter}
          handleAdd={handleAdd}
          id={id}
          showFavorites={showFavorites}
          data={data}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          setShowCreateItem={setShowCreateItem}
        />
      )}

      <EditContainer
        data={data}
        id={id}
        opened={opened}
        open={open}
        close={close}
      />

      <ContextMenu
        type="container"
        onDelete={handleDelete}
        onEdit={open}
        onAdd={handleAdd}
        onCreateItem={() => setShowCreateItem(true)}
        onCreateContainer={() => setShowCreateContainer(true)}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        type="container"
        name={data?.name}
        itemList={data?.items}
        isRemove={isRemove}
      />

      {showCreateContainer ? (
        <NewContainer
          opened={showCreateContainer}
          close={() => setShowCreateContainer(false)}
          hidden={["locationId", "containerId"]}
          containerId={data?.id}
          locationId={data?.locationId}
          containerList={data?.containers}
          mutateKey={`container${id}`}
          data={data}
        />
      ) : null}

      {showCreateItem ? (
        <CreateItem
          data={data}
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          mutate={mutate}
        />
      ) : null}
    </>
  );
};

export default Page;
