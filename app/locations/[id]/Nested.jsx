import { useState } from "react";
import ContainerAccordion from "@/app/components/ContainerAccordion";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import DraggableItemCard from "@/app/components/DraggableItemCard";
import Empty from "@/app/components/Empty";
import MasonryContainer from "@/app/components/MasonryContainer";
import { sortObjectArray } from "@/app/lib/helpers";
import {
  moveItem,
  moveContainerToContainer,
  moveContainerToLocation,
  removeFromContainer,
  moveItemToContainer,
  moveItemNested,
} from "../api/db";

const Nested = ({
  data,
  filter,
  handleAdd,
  mutate,
  handleItemFavoriteClick,
  handleContainerFavoriteClick,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const items = data?.items?.filter((item) => !item.containerId);
  const containers = data?.containers?.filter(
    (container) => !container.parentContainerId
  );

  const allItems = sortObjectArray(items?.concat(containers));
  const filteredResults = allItems?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    const destination = over?.data?.current?.item;
    const source = active.data.current.item;

    if (source.type === "container" && destination?.type === "container") {
      if (
        source?.parentContainerId == destination?.id ||
        source?.id == destination?.id
      )
        return setActiveItem(null);
    }

    if (
      !source.type === "container" &&
      destination?.name === source?.container?.name
    ) {
      return setActiveItem(null);
    }

    if (!destination) {
      if (
        (source.type === "item" && !source?.containerId) ||
        (source.type === "container" && !source?.parentContainerId)
      ) {
        return setActiveItem(null);
      } else {
        await mutate(
          removeFromContainer({
            id: source?.id,
            isContainer: source.type === "container",
          })
        );
      }
    }

    if (source.type === "item") {
      if (!destination && !source.containerId) return setActiveItem(null);
      await mutate(
        moveItemNested({
          itemId: source.id,
          containerId: destination?.id ? destination.id : null,
        })
      );
    }

    if (destination?.type === "container") {
      if (source.type === "item") {
        await moveItem({
          itemId: source.id,
          containerId: destination.id,
          containerLocationId: data?.id,
        });
      }
      if (source.type === "container") {
        await mutate(
          moveContainerToContainer({
            containerId: source.id,
            newContainerId: destination.id,
            newContainerLocationId: destination.locationId,
          })
        );
      }
    }

    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <MasonryContainer>
        {!data?.items?.length && !data?.containers?.length ? (
          <Empty onClick={handleAdd} />
        ) : null}
        {filteredResults?.map((cardItem) => {
          return cardItem?.hasOwnProperty("parentContainerId") ? (
            <ContainerAccordion
              key={cardItem?.name}
              container={cardItem}
              bgColor="!bg-bluegray-200"
              activeItem={activeItem}
              handleItemFavoriteClick={handleItemFavoriteClick}
              handleFavoriteClick={handleContainerFavoriteClick}
            />
          ) : (
            <DraggableItemCard
              key={cardItem?.name}
              activeItem={activeItem}
              item={cardItem}
              bgColor="!bg-bluegray-200"
            />
          );
        })}
      </MasonryContainer>
      <DragOverlay>
        {activeItem ? (
          activeItem.hasOwnProperty("parentContainerId") ? (
            <ContainerAccordion
              container={activeItem}
              dragging
              bgColor="!bg-bluegray-200"
              shadow="!drop-shadow-lg"
            />
          ) : (
            <DraggableItemCard
              item={activeItem}
              overlay
              bgColor="!bg-bluegray-200"
              shadow="!drop-shadow-lg"
            />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Nested;
