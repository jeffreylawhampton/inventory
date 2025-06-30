import { toggleFavorite } from "../lib/db";
import { notify } from "../lib/handlers";
import { mutate } from "swr";
import { sortObjectArray } from "../lib/helpers";
import {
  moveContainerToContainer,
  moveContainerToLocation,
  moveItem,
} from "./api/db";
import { deleteObject, deleteVarious } from "../lib/db";
import { groupBy } from "lodash";

export const addUnique = (list, value, setList) => {
  if (!list?.includes(value)) {
    setList([...list, value]);
  }
};

export const handleAwaitOpen = async (
  destination,
  openLocations,
  setOpenLocations,
  openContainers,
  setOpenContainers
) => {
  const { type, name, location } = destination;

  if (type === "container") {
    addUnique(openLocations, location?.name, setOpenLocations);
    addUnique(openContainers, name, setOpenContainers);
  } else if (type === "location") {
    addUnique(openLocations, name, setOpenLocations);
  }
};

export const checkInvalidMove = (source, destination) => {
  const sameTypeAndParent =
    source?.type === destination?.type &&
    (source.parentContainerId === destination.id ||
      source.id === destination.id);

  const movingToSameLocation =
    destination?.type === "location" &&
    source.type === "container" &&
    !source.parentContainerId &&
    destination.id === source.locationId;

  const containerSameAsSource =
    destination?.type === "container" && destination.id === source?.containerId;

  return sameTypeAndParent || movingToSameLocation || containerSameAsSource;
};

export const handleFavoriteClick = async (data, key) => {
  const add = !data?.favorite;
  const { type } = data;

  try {
    await mutate(key, toggleFavorite({ id: data?.id, type, add }), {
      optimisticData: {
        ...data,
        favorite: add,
      },
      populateCache: false,
      revalidate: true,
      rollbackOnError: true,
    });
    mutate("/locations/api");

    notify({
      message: add
        ? `Added ${data?.name} to favorites`
        : `Removed ${data?.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleContainerClick = ({
  container,
  openLocations,
  setOpenLocations,
  openContainers,
  setOpenContainers,
  router,
}) => {
  addUnique(openLocations, container?.location?.name, setOpenLocations);
  addUnique(
    openContainers,
    container?.parentContainer?.name,
    setOpenContainers
  );
  router.push(`?type=container&id=${container.id}`);
};

export const handleCardFavoriteClick = async ({ item, type, key, data }) => {
  const add = !item?.favorite;
  const optimisticData = structuredClone(data);

  const itemToUpdate = optimisticData[type + "s"]?.find(
    (i) => i.id === item.id
  );
  itemToUpdate.favorite = add;
  try {
    await mutate(key, toggleFavorite({ type, id: item.id, add }), {
      optimisticData,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    });

    notify({
      message: add
        ? `Added ${item.name} to favorites`
        : `Removed ${item.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleSidebarItemFavoriteClick = async ({
  item,
  selectedKey,
  layoutData,
}) => {
  const add = !item?.favorite;
  const updated = structuredClone(layoutData);

  const location = updated?.locations?.find((l) => l.id === item.locationId);
  if (item?.containerId) {
    const container = location?.containers?.find(
      (c) => c.id === item.containerId
    );
    const itemToUpdate = container?.items?.find((i) => i.id === item.id);
    if (itemToUpdate) itemToUpdate.favorite = add;
  } else {
    const itemToUpdate = location?.items?.find((i) => i.id === item.id);
    itemToUpdate.favorite = add;
  }
  try {
    await mutate(
      "/locations/api",
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData: updated,
        populateCache: false,
        revalidate: true,
        rollbackOnError: true,
      }
    );
    mutate(selectedKey);

    notify({
      message: add
        ? `Added ${item.name} to favorites`
        : `Removed ${item.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleMoveContainerToLocation = async (
  source,
  destination,
  updated
) => {
  const oldLocation = updated.locations?.find(
    (l) => l.id === source.locationId
  );

  if (source.parentContainerId) {
    const oldParent = oldLocation?.containers?.find(
      (c) => c.id === source.parentContainerId
    );
    if (oldParent) {
      oldParent.containers = oldParent?.containers?.filter(
        (c) => c.id !== source.id
      );
    }
  }

  oldLocation.containers = oldLocation?.containers?.filter(
    (c) => c.id !== source.id
  );

  const updatedContainer = {
    ...source,
    locationId: destination.id,
    parentContainerId: null,
  };

  const newLocation = updated?.locations?.find((l) => l.id === destination.id);
  if (newLocation) {
    newLocation.containers = sortObjectArray([
      ...newLocation.containers,
      updatedContainer,
    ]);
  }

  await mutate(
    "/locations/api",
    moveContainerToLocation({
      containerId: source.id,
      locationId: destination.id,
    }),
    {
      optimisticData: updated,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    }
  );
};

export const handleMoveItem = async (source, destination, updated) => {
  const oldLocation = updated?.locations?.find(
    (l) => l.id === source.locationId
  );

  if (source.containerId) {
    const oldContainer = oldLocation?.containers?.find(
      (c) => c.id === source.containerId
    );

    if (oldContainer)
      oldContainer.items = oldContainer?.items?.filter(
        (i) => i.id != source.id
      );
  } else {
    oldLocation.items = oldLocation.items?.filter((i) => i.id != source.id);
  }

  const newLocation =
    destination.type === "container"
      ? updated.locations?.find((l) => l.id === destination.locationId)
      : updated.locations?.find((l) => l.id === destination.id);

  if (destination.type === "container") {
    const newContainer = newLocation?.containers?.find(
      (c) => c.id === destination.id
    );
    newContainer.items = sortObjectArray([...newContainer.items, source]);
  } else {
    newLocation.items = sortObjectArray([...newLocation.items, source]);
  }

  await mutate(
    "/locations/api",
    moveItem({
      itemId: source.id,
      destinationId: destination.id,
      destinationType: destination.type,
      destinationLocationId:
        destination.type === "location"
          ? destination.id
          : destination.locationId,
    }),
    {
      optimisticData: updated,
      revalidate: true,
      rollbackOnError: true,
      populateCache: false,
    }
  );
};

export const handleMoveContainerToContainer = async (
  source,
  destination,
  updated
) => {
  const oldLocation = updated.locations?.find(
    (loc) => loc.id === source.locationId
  );

  const container = oldLocation?.containers?.find((c) => c.id === source.id);

  if (container.locationId != destination.locationId) {
    oldLocation.containers = oldLocation?.containers?.filter(
      (c) => c.id != source.id
    );

    const newLocation = updated.locations?.find(
      (l) => l.id === destination.locationId
    );

    newLocation.containers = [...newLocation.containers, container];
  }
  container.parentContainerId = destination.id;
  container.parentContainer = destination;

  await mutate(
    "/locations/api",
    moveContainerToContainer({
      containerId: container.id,
      newContainerId: destination.id,
      newContainerLocationId: destination.locationId,
    }),
    {
      optimisticData: updated,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    }
  );
};

export const handleDragEnd = async ({
  over,
  data,
  activeItem,
  openLocations,
  setOpenLocations,
  openContainers,
  setOpenContainers,
  setActiveItem,
  key,
}) => {
  const destination = over?.data?.current?.item;
  const source = { ...activeItem };

  if (!destination || checkInvalidMove(source, destination)) {
    return setActiveItem(null);
  }

  await handleAwaitOpen(
    destination,
    openLocations,
    setOpenLocations,
    openContainers,
    setOpenContainers
  );

  const updatedData = structuredClone(data);

  try {
    if (source.type === "item") {
      handleMoveItem(source, destination, updatedData);
    } else if (source.type === "container") {
      if (destination.type === "location") {
        handleMoveContainerToLocation(source, destination, updatedData);
      } else if (destination.type === "container") {
        handleMoveContainerToContainer(source, destination, updatedData);
      }
    }
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  } finally {
    setActiveItem(null);
    setTimeout(function () {
      mutate(key);
    }, 200);
  }
};

export const handleToggleSelect = (value, list, setList) => {
  if (!list?.includes(value)) {
    setList([...list, value]);
  }

  list?.includes(value)
    ? setList(list?.filter((i) => i != value))
    : setList([...list, value]);
};

export const handleToggleDelete = (item, value, list, setList) => {
  setList(
    list?.find((i) => i[value] === item[value])
      ? list?.filter((i) => i[value] != item[value])
      : [...list, item]
  );
};

const getIdArrays = async (obj) => {
  const idArrays = {};
  for (const key in obj) {
    idArrays[key] = obj[key]?.map((i) => parseInt(i.id));
  }
  return idArrays;
};

export const handleDelete = async (
  selectedForDeletion,
  setSelectedForDeletion,
  data,
  setShowDelete,
  selectedType,
  selectedId,
  router,
  pageData
) => {
  const grouped = groupBy(selectedForDeletion, "type");

  const idArrays = await getIdArrays(grouped);
  const updated = structuredClone(data);

  const shouldRedirect = selectedForDeletion?.find(
    (item) => item.name === pageData?.name
  );

  updated?.locations?.map((l) => {
    l.containers?.map(
      (c) =>
        (c.items = c?.items?.filter((i) => !idArrays?.item?.includes(i.id)))
    );
    l.containers = l?.containers?.filter(
      (c) => !idArrays?.container?.includes(c.id)
    );
    l.items = l?.items?.filter((i) => !idArrays?.item?.includes(i.id));
  });

  updated.locations = updated?.locations?.filter(
    (l) => !idArrays?.location?.includes(parseInt(l.id))
  );

  try {
    await mutate("/locations/api", deleteVarious(idArrays), {
      optimisticData: updated,
      populateCache: false,
      revalidate: true,
      rollbackOnError: true,
    });
    await mutate(
      `/locations/api/selected?type=${selectedType}&id=${selectedId}`
    );

    notify({ message: `Deleted ${selectedForDeletion?.length} objects` });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  } finally {
    setShowDelete(false);
    setSelectedForDeletion([]);
    if (shouldRedirect) {
      if (pageData?.parentContainerId) {
        router.push(
          `/locations?type=container&id=${pageData.parentContainerId}`
        );
      } else if (pageData?.locationId) {
        router.push(`/locations?type=location&id=${pageData.locationId}`);
      } else {
        router.push("/locations");
      }
    }
  }
};

export const handleDeleteSelected = async (itemToDelete, router) => {
  const parsedId = parseInt(itemToDelete.id);
  if (!itemToDelete?.type) return "You forgot the type";

  try {
    await deleteObject({ id: parsedId, type: itemToDelete.type });
    mutate("/locations/api");

    if (itemToDelete?.parentContainerId) {
      mutate(`/locations?type=container&id=${itemToDelete.parentContainerId}`);
      router.push(
        `/locations?type=container&id=${itemToDelete.parentContainerId}`
      );
    } else if (itemToDelete?.locationId) {
      mutate(`/locations?type=location&id=${itemToDelete.locationId}`);
      router.push(`/locations?type=location&id=${itemToDelete.locationId}`);
    } else {
      router.push("/locations");
    }
    notify({
      message: `Successfully deleted ${itemToDelete?.name?.toLowerCase()}`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const animateResize = (from, to, panel, duration = 300) => {
  if (!panel) return;

  const start = performance.now();

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const currentSize = from + (to - from) * easeOutCubic(progress);

    panel.resize(currentSize);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
