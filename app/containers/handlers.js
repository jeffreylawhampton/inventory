import { toggleFavorite, deleteMany, deleteObject } from "../lib/db";
import { mutate } from "swr";
import {
  buildContainerTree,
  sortObjectArray,
  toggleListFavorite,
} from "../lib/helpers";
import { mutateProps, notify } from "../lib/handlers";
import { moveContainerToContainer, moveItem } from "./api/db";

export const handleDeleteMany = async ({
  data,
  selectedContainers,
  setSelectedContainers,
  setShowDelete,
  mutateKey,
}) => {
  try {
    await mutate(
      mutateKey,
      deleteMany({ selected: selectedContainers, type: "container" }),
      {
        optimisticData: data?.filter((c) => !selectedContainers.includes(c.id)),
        ...mutateProps,
      }
    );
    setSelectedContainers([]);
    setShowDelete(false);
    notify({
      message: `Deleted ${selectedContainers?.length} ${
        selectedContainers?.length === 1 ? "container" : "containers"
      }`,
    });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleFavoriteClick = async ({ data, mutateKey }) => {
  const add = !data.favorite;

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "container", id: data.id, add }),
      {
        optimisticData: { ...data, favorite: add },
        ...mutateProps,
      }
    );
    notify({
      message: s(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      ),
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleDelete = async ({ data, mutateKey, isSafari }) => {
  if (
    !isSafari &&
    !confirm(
      `Are you sure you want to delete ${data?.name || "this container"}?`
    )
  )
    return;
  try {
    await mutate(
      mutateKey,
      deleteObject({ id: data.id, type: "container", navigate: "/containers" })
    );
    notify({ message: `Deleted ${data?.name}` });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleNestedItemFavoriteClick = async ({
  item,
  data,
  mutateKey,
}) => {
  const add = !item.favorite;

  let optimisticData;

  if (Array.isArray(data)) {
    optimisticData = data.map((c) =>
      c.id === item.containerId
        ? { ...c, items: toggleListFavorite(c.items, item) }
        : c
    );
  } else if (item.containerId === data?.id) {
    optimisticData = { ...data, items: toggleListFavorite(data.items, item) };
  } else {
    optimisticData = {
      ...data,
      containers: data.containers?.map((c) =>
        c.id === item.containerId
          ? { ...c, items: toggleListFavorite(c.items, item) }
          : { ...c }
      ),
    };
  }

  try {
    const success = await mutate(
      mutateKey,
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData,
        ...mutateProps,
      }
    );

    if (success) {
      notify({
        message: add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`,
      });
    }
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleContainerFavorite = async ({
  container,
  data,
  mutateKey,
}) => {
  const add = !container.favorite;
  let optimisticData;
  if (Array.isArray(data)) {
    optimisticData = toggleListFavorite(data, container);
  } else {
    if (data.id === container.id) {
      optimisticData = { ...data, favorite: add };
    } else {
      optimisticData = {
        ...data,
        containers: toggleListFavorite(data?.containers, container),
      };
    }
  }

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "container", id: container.id, add }),
      {
        optimisticData,
        ...mutateProps,
      }
    );

    notify({
      message: add
        ? `Added ${container.name} to favorites`
        : `Removed ${container.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const addUnique = (list, value, setList) => {
  if (!list?.includes(value)) {
    setList([...list, value]);
  }
};

export const handleAwaitOpen = async (
  destination,
  openContainers,
  setOpenContainers,
  openContainerItems,
  setOpenContainerItems,
  view
) => {
  const { name } = destination;

  addUnique(openContainers, name, setOpenContainers);
  view === 1 && addUnique(openContainerItems, name, setOpenContainerItems);
};

export const handleMoveItem = async (
  source,
  destination,
  updatedData,
  mutateKey
) => {
  if (!destination) return;
  let optimisticData;
  if (Array.isArray(updatedData)) {
    optimisticData = updatedData?.map((c) => {
      if (c.id === destination.id) {
        return {
          ...c,
          items: sortObjectArray([
            ...c.items,
            {
              ...source,
              containerId: destination.id,
              container: { ...destination },
            },
          ]),
        };
      } else if (c.id === source.containerId) {
        return { ...c, items: c.items?.filter((i) => i.id != source.id) };
      } else {
        return { ...c };
      }
    });
  }

  await mutate(
    mutateKey,
    moveItem({
      itemId: source.id,
      containerId: destination.id,
      containerLocationId: destination.locationId ?? null,
    }),
    {
      optimisticData,
      ...mutateProps,
    }
  );
};

export const checkInvalidMove = (source, destination) => {
  const sameTypeAndParent =
    source?.type === destination?.type &&
    (source.parentContainerId === destination.id ||
      source.id === destination.id);

  const containerSameAsSource =
    destination?.type === "container" && destination.id === source?.containerId;

  return sameTypeAndParent || containerSameAsSource;
};

export const handleMoveContainer = async (
  source,
  destination,
  updatedData,
  mutateKey
) => {
  let optimisticData;
  if (Array.isArray(updatedData)) {
    optimisticData = updatedData.map((c) => {
      if (c.id === source.parentContainerId) {
        return {
          ...c,
          containers: c.containers?.filter((co) => co.id != source.id),
        };
      } else if (c.id === source.id) {
        return {
          ...c,
          parentContainerId: destination?.id ?? null,
          parentContainer: destination ?? null,
        };
      } else {
        return c;
      }
    });
  } else {
    optimisticData = {
      ...updatedData,
      containers: updatedData?.containers?.map((c) => {
        if (c.id === source.parentContainerId) {
          return {
            ...c,
            containers: c.containers?.filter((co) => co.id != source.id),
          };
        } else if (c.id === source.id) {
          return {
            ...c,
            parentContainerId: destination?.id ?? null,
            parentContainer: destination ?? null,
          };
        } else {
          return c;
        }
      }),
    };
  }

  await mutate(
    mutateKey,
    moveContainerToContainer({
      containerId: source.id,
      newContainerId: destination?.id ?? null,
      newContainerLocationId: destination?.locationId ?? null,
    }),
    {
      optimisticData: optimisticData,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    }
  );

  return optimisticData;
};

export const handleDragEnd = async ({
  over,
  data,
  activeItem,
  openContainers,
  setOpenContainers,
  openContainerItems,
  setOpenContainerItems,
  setActiveItem,
  mutateKey,
  view,
  buildContainerTree,
  setFilteredResults,
  invalidContainers,
}) => {
  const destination = over?.data?.current?.item;
  const source = { ...activeItem };

  if (
    checkInvalidMove(source, destination) ||
    invalidContainers?.includes(destination?.id)
  ) {
    return setActiveItem(null);
  }

  if (!source?.parentContainerId && !destination) {
    setActiveItem(null);
    return setFilteredResults(sortObjectArray(buildContainerTree(data)));
  }

  destination &&
    (await handleAwaitOpen(
      destination,
      openContainers,
      setOpenContainers,
      openContainerItems,
      setOpenContainerItems,
      view
    ));

  const updatedData = structuredClone(data);

  try {
    const moveFunction =
      source.type === "item" ? handleMoveItem : handleMoveContainer;
    moveFunction(
      source,
      destination,
      updatedData,
      mutateKey,
      setFilteredResults
    );
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  } finally {
    setActiveItem(null);
  }
};
