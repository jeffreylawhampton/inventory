import { useState } from "react";
import MasonryContainer from "../components/MasonryContainer";
import ContainerAccordion from "../components/ContainerAccordion";
import DraggableItemCard from "../components/DraggableItemCard";
import { sortObjectArray } from "../lib/helpers";
import { moveContainerToContainer, moveItem } from "./api/db";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";

const Nested = ({ containerList, mutate }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [openContainers, setOpenContainers] = useState([]);
  const filteredResults = sortObjectArray(
    containerList?.filter((container) => !container?.parentContainerId)
  );

  const handleChange = (container) => {
    openContainers?.includes(container.name)
      ? setOpenContainers(
          openContainers?.filter((con) => con != container.name)
        )
      : setOpenContainers([...openContainers, container?.name]);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }
  const handleDragEnd = async (event) => {
    setActiveItem(null);
    const {
      over,
      active: {
        data: {
          current: { item },
        },
      },
    } = event;
    const destination = over?.data?.current?.item;

    if (
      item?.parentContainerId == destination?.id ||
      destination?.id === item.id ||
      (item?.containerId === destination?.id &&
        destination?.hasOwnProperty("parentContainerId"))
    )
      return;
    if (item?.hasOwnProperty("parentContainerId")) {
      if (!destination || destination?.id === item?.id) {
        await mutate(
          moveContainerToContainer({
            containerId: item.id,
            newContainerId: null,
          })
        );
        return;
      }

      await mutate(
        moveContainerToContainer({
          containerId: item.id,
          newContainerId: destination.id,
          newContainerLocationId: destination.locationId,
        })
      );
    } else {
      await mutate(
        moveItem({
          itemId: item.id,
          containerId: destination?.id,
          newContainerLocationId: destination?.locationId,
        })
      );
    }
  };

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <MasonryContainer desktopColumns={3}>
          {filteredResults?.map((container) => {
            return (
              <ContainerAccordion
                container={container}
                activeItem={activeItem}
                key={container.name}
                handleContainerClick={handleChange}
              />
            );
          })}
        </MasonryContainer>
        <DragOverlay>
          <div className="max-w-screen overflow-hidden">
            {activeItem ? (
              activeItem.hasOwnProperty("parentContainerId") ? (
                <ContainerAccordion
                  container={activeItem}
                  openContainers={openContainers}
                  handleChange={handleChange}
                  showLocation
                />
              ) : (
                <DraggableItemCard item={activeItem} keepVisible />
              )
            ) : null}
          </div>
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Nested;
