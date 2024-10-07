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

  const allItems = sortObjectArray(items.concat(containers));
  const filteredResults = allItems?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    const destination = over?.data?.current;
    const source = active.data.current;
    const destinationType = destination?.isContainer ? "container" : null;
    const sourceType = source.isContainer ? "container" : "item";

    if (sourceType === "container" && destinationType === "container") {
      if (
        source.item.parentContainerId == destination.item.id ||
        source.item.id == destination.item.id
      )
        return setActiveItem(null);
    }

    if (
      !source.isContainer &&
      destination?.item?.name === source.item?.container?.name
    ) {
      return setActiveItem(null);
    }

    if (!destination) {
      if (
        (sourceType === "item" && !source.item?.containerId) ||
        (sourceType === "container" && !source.item?.parentContainerId)
      ) {
        return setActiveItem(null);
      } else {
        await mutate(
          removeFromContainer({
            id: source?.item.id,
            isContainer: source.isContainer,
          })
        );
      }
    }

    if (destinationType === "container") {
      await mutate(
        moveContainerToContainer({
          containerId: source.item.id,
          newContainerId: destination.item.id,
          newContainerLocationId: destination.item.locationId,
        })
      );
    }

    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  console.log(data);

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
