import {
  moveItem,
  moveContainerToLocation,
  moveContainerToContainer,
} from "./api/db";

export const handleDragEnd = async (event) => {
  const { active, over } = event;
  if (!over?.data) {
    setActiveItem(null);
    return;
  }
  const destination = over.data.current.item;
  const source = active.data.current.item;

  const destinationType = destination.hasOwnProperty("parentContainerId")
    ? "container"
    : "location";

  const sourceType = source.hasOwnProperty("parentContainerId")
    ? "container"
    : "item";

  if (sourceType === "container" && destinationType === "container") {
    if (
      source.parentContainerId == destination.id ||
      source.id == destination.id
    )
      return setActiveItem(null);
  }
  if (sourceType === "item") {
    await moveItem({
      itemId: active.data.current.item.id,
      destinationType,
      destinationId: over.data.current.item.id,
      destinationLocationId:
        destinationType === "container"
          ? over.data.current.item.locationId
          : null,
    });
  } else {
    if (destinationType === "location") {
      await moveContainerToLocation({
        containerId: active.data.current.item.id,
        locationId: over.data.current.item.id,
      });
    }

    if (destinationType === "container") {
      await moveContainerToContainer({
        containerId: active.data.current.item.id,
        newContainerId: over.data.current.item.id,
        newContainerLocationId: over.data.current.item.locationId,
      });
    }
  }
  setActiveItem(null);
};

export const handleCheck = (locId) => {
  setFilters((prev) =>
    prev?.includes(locId)
      ? prev?.filter((loc) => loc != locId)
      : [...prev, locId]
  );
};

export function handleDragStart(event) {
  setActiveItem(event.active.data.current.item);
}
