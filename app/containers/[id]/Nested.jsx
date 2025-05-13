import { useState, useContext, useEffect } from "react";
import {
  ContainerAccordion,
  DraggableItemCard,
  EmptyCard,
  Loading,
  MasonryContainer,
} from "@/app/components";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { sortObjectArray, buildContainerTree } from "@/app/lib/helpers";
import { moveItem, moveContainerToContainer } from "../api/db";
import { mutate } from "swr";
import { ContainerContext } from "./layout";
import { cardStyles } from "@/app/lib/styles";

const Nested = ({
  data,
  isLoading,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  id,
  items,
  setItems,
  results,
  setResults,
  setShowCreateContainer,
  setShowCreateItem,
  handleAdd,
}) => {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    setResults(data?.containerArray);
    setItems(data?.items);
  }, [data]);

  const {
    openContainers,
    setOpenContainers,
    setOpenContainerItems,
    openContainerItems,
  } = useContext(ContainerContext);

  const handleAwaitOpen = async (destination, isItem) => {
    if (
      destination &&
      isItem &&
      !openContainerItems?.includes(destination.name)
    ) {
      setOpenContainerItems([...openContainerItems, destination.name]);
    }
    if (destination && !openContainers.includes(destination.name)) {
      setOpenContainers([...openContainers, destination.name]);
    }
  };

  function handleDragStart(event) {
    const active = event.active.data.current.item;
    setActiveItem(active);
    if (active.type === "item") {
      setItems(items?.filter((i) => i.id != active.id));
    } else {
      const updated = data?.containerArray?.filter(
        (con) => con.id != event.active.data.current.item.id
      );
      setResults(sortObjectArray(buildContainerTree(updated, data.id)));
    }
  }

  const handleDragEnd = async (event) => {
    const { over } = event;

    const destination = over?.data?.current?.item;
    const source = { ...activeItem };

    await handleAwaitOpen(destination, source.type === "item");

    setActiveItem(null);
    if (
      (source.type === "item" &&
        destination &&
        source.containerId === destination.id) ||
      (source.type === "item" && !destination && source.containerId === data.id)
    ) {
      return setItems(data.items);
    }
    const originalData = sortObjectArray(
      buildContainerTree(data.containerArray, data.id)
    );

    if (
      (source?.type === "container" &&
        destination &&
        source.parentContainerId === destination.id) ||
      (source.type === "container" &&
        destination &&
        source.id === destination.id)
    ) {
      return setResults(originalData);
    }

    if (source.type === "container") {
      const updated = { ...data };
      const containerToUpdate = updated?.containerArray?.find(
        (con) => con.id === source.id
      );
      containerToUpdate.parentContainerId = destination?.id || data.id;

      try {
        mutate(
          `container${data.id}`,
          moveContainerToContainer({
            containerId: source.id,
            newContainerId: destination?.id || data.id,
            newContainerLocationId: data.locationId,
          }),
          {
            optimisticData: updated,
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        );
        return setResults(
          sortObjectArray(buildContainerTree(updated.containerArray, data.id))
        );
      } catch (e) {
        toast.error("Something went wrong");
        throw new Error(e);
      }
    }

    if (source.type === "item") {
      if (
        (destination?.type === "container" &&
          source?.containerId === destination.id) ||
        (!destination && !source.containerId)
      ) {
        return setResults(originalData);
      }

      const updated = { ...data };
      if (!destination) {
        const oldContainer = updated?.containerArray?.find(
          (con) => con.id === source.containerId
        );
        oldContainer.items = oldContainer.items?.filter(
          (i) => i.id != source.id
        );
        updated.items.push(source);
        setItems(sortObjectArray(updated.items));
        setResults(
          sortObjectArray(buildContainerTree(updated?.containerArray))
        );
      } else {
        const newContainer = updated?.containerArray?.find(
          (con) => con.id === destination.id
        );
        newContainer.items = sortObjectArray([...newContainer.items, source]);
        if (source.containerId === data.id) {
          updated.items = updated.items.filter((i) => i.id != source.id);
        } else {
          const oldContainer = updated.containerArray?.find(
            (con) => con.id === source.containerId
          );
          oldContainer.items = oldContainer.items?.filter(
            (i) => i.id != source.id
          );
        }
      }
      try {
        setResults(
          sortObjectArray(buildContainerTree(updated?.containerArray))
        );
        setItems(sortObjectArray(updated.items));
        return mutate(
          `container${id}`,
          moveItem({
            itemId: source.id,
            containerId: destination?.id || data.id,
            containerLocationId: data?.locationId,
          }),
          {
            optimisticData: updated,
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        );
      } catch (e) {
        toast.error("Something went wrong");
        throw new Error(e);
      }
    }

    return;
  };

  if (isLoading) return <Loading />;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      {data?.items?.length || data?.containerArray?.length ? (
        <MasonryContainer>
          {items?.map((item) => {
            return (
              <DraggableItemCard
                key={item?.name}
                activeItem={activeItem}
                item={item}
                bgColor={cardStyles.defaultBg}
                handleItemFavoriteClick={handleItemFavoriteClick}
              />
            );
          })}
          {results?.map((container) => {
            return (
              <ContainerAccordion
                key={container?.name}
                container={container}
                bgColor="!bg-bluegray-200"
                activeItem={activeItem}
                handleContainerFavoriteClick={handleContainerFavoriteClick}
                handleItemFavoriteClick={handleItemFavoriteClick}
                openContainers={openContainers}
                openContainerItems={openContainerItems}
                setOpenContainers={setOpenContainers}
                setOpenContainerItems={setOpenContainerItems}
              />
            );
          })}
        </MasonryContainer>
      ) : (
        <EmptyCard
          move={handleAdd}
          add={() => setShowCreateItem(true)}
          addContainer={() => setShowCreateContainer(true)}
        />
      )}

      <DragOverlay>
        <div className="max-w-screen overflow-hidden">
          {activeItem ? (
            activeItem.hasOwnProperty("parentContainerId") ? (
              <ContainerAccordion
                container={activeItem}
                openContainers={openContainers}
                openContainerItems={openContainerItems}
              />
            ) : (
              <DraggableItemCard
                item={activeItem}
                overlay
                bgColor="!bg-bluegray-100"
                shadow="!drop-shadow-md"
              />
            )
          ) : null}
        </div>
      </DragOverlay>
    </DndContext>
  );
};

export default Nested;
