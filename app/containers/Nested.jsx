import { useState, useContext, useEffect } from "react";
import { ContainerAccordion, DraggableItemCard } from "@/app/components";
import { sortObjectArray } from "../lib/helpers";
import {
  moveContainerToContainer,
  moveItem,
  removeFromContainer,
} from "./api/db";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { buildContainerTree } from "../lib/helpers";
import { notify } from "../lib/handlers";
import { ContainerContext } from "./layout";
import { mutate } from "swr";

const Nested = ({
  data,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  showDelete,
  setShowDelete,
  selectedContainers,
  handleSelect,
}) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    data?.length &&
      setFilteredResults(sortObjectArray(buildContainerTree(data)));
  }, [data]);

  const {
    openContainers,
    setOpenContainers,
    openContainerItems,
    setOpenContainerItems,
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

  const handleChange = (container) => {
    openContainers?.includes(container.name)
      ? setOpenContainers(
          openContainers?.filter((con) => con != container.name)
        )
      : setOpenContainers([...openContainers, container?.name]);
  };

  function handleDragStart(event) {
    const active = event.active?.data?.current?.item;
    setActiveItem(active);
    if (data?.length) {
      const updated = data?.filter((con) => con.id != active.id);
      setFilteredResults(sortObjectArray(buildContainerTree(updated)));
    }
  }

  const handleDragEnd = async (event) => {
    const { over, active } = event;
    const destination = over?.data?.current?.item;
    const source = { ...activeItem };
    await handleAwaitOpen(destination, source.type === "item");
    const isContainer = activeItem.hasOwnProperty("parentContainerId");
    const originalData = sortObjectArray(buildContainerTree([...data]));
    if (
      (destination &&
        activeItem.parentContainerId &&
        activeItem?.parentContainerId === destination.id) ||
      (!activeItem.parentContainerId && !destination) ||
      (isContainer && destination && activeItem.id === destination.id) ||
      (!isContainer && destination && destination.id === active.containerId)
    ) {
      setFilteredResults(originalData);
      return setActiveItem(null);
    }

    if (isContainer) {
      if (!destination) {
        const updated = [...data];
        const containerToUpdate = updated.find(
          (container) => container.id === activeItem.id
        );
        const oldContainer = updated.find(
          (con) => con.id === activeItem.parentContainerId
        );
        oldContainer.containerCount -= containerToUpdate.containerCount + 1;
        oldContainer.itemCount -= containerToUpdate.itemCount;
        containerToUpdate.parentContainerId = null;
        oldContainer.containers = oldContainer.containers?.filter(
          (con) => con.id != activeItem.id
        );
        const sorted = sortObjectArray(buildContainerTree(updated));

        try {
          removeFromContainer({
            id: activeItem.id,
            isContainer: true,
          });
          setActiveItem(null);
          return setFilteredResults(sorted);
        } catch (e) {
          notify({ isError: true });
          throw new Error(e);
        }
      } else {
        const optimistic = [...data];
        const containerToUpdate = optimistic.find(
          (container) => container.id === activeItem.id
        );
        containerToUpdate.parentContainerId = destination.id;
        const newContainer = optimistic.find(
          (con) => con.id === destination.id
        );
        newContainer?.containers?.push(activeItem);
        if (activeItem.parentContainerId) {
          const oldContainer = optimistic.find(
            (con) => con.id === activeItem.parentContainerId
          );

          oldContainer.containers?.filter((con) => con.id != activeItem.id);
          oldContainer.containerCount -= containerToUpdate.containerCount + 1;
          oldContainer.itemCount -= containerToUpdate.itemCount;
          newContainer.containerCount += containerToUpdate.containerCount + 1;
          newContainer.itemCount += containerToUpdate.itemCount;
        }
        try {
          setActiveItem(null);
          setFilteredResults(sortObjectArray(buildContainerTree(optimistic)));
          await mutate(
            "/containers/api",
            moveContainerToContainer({
              containerId: activeItem.id,
              newContainerId: destination.id,
              newContainerLocationId: destination.locationId,
            }),
            {
              optimisticData: optimistic,
              rollbackOnError: true,
              populateCache: false,
              revalidate: true,
            }
          );
        } catch (e) {
          notify({ isError: true });

          throw new Error(e);
        }
      }
    } else {
      const updated = [...data];
      let oldContainer = updated.find(
        (con) => con.id === activeItem.containerId
      );
      const newContainer = updated.find((con) => con.id === destination.id);
      oldContainer.items = oldContainer?.items?.filter(
        (item) => item.id != activeItem.id
      );
      newContainer.items?.push(activeItem);
      oldContainer.itemCount -= 1;
      newContainer.itemCount += 1;
      setFilteredResults(sortObjectArray(buildContainerTree(updated)));
      try {
        moveItem({
          itemId: activeItem.id,
          containerId: destination.id,
          newContainerLocationId: destination?.locationId,
        });
        mutate("/containers/api");
      } catch (e) {
        notify({ isError: true });
        throw new Error(e);
      }
    }
    mutate("/containers/api");
    return setActiveItem(null);
  };

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            800: 2,
            1200: 3,
            1800: 4,
            2200: 5,
          }}
        >
          <Masonry
            className={`grid-flow-col-dense grow pb-12 relative`}
            gutter={10}
          >
            {filteredResults?.map((container) => {
              return (
                <ContainerAccordion
                  container={container}
                  activeItem={activeItem}
                  key={container.name}
                  showLocation
                  handleContainerClick={handleChange}
                  handleItemFavoriteClick={handleItemFavoriteClick}
                  handleContainerFavoriteClick={handleContainerFavoriteClick}
                  openContainers={openContainers}
                  setOpenContainers={setOpenContainers}
                  openContainerItems={openContainerItems}
                  setOpenContainerItems={setOpenContainerItems}
                  showDelete={showDelete}
                  setShowDelete={setShowDelete}
                  isSelected={selectedContainers?.includes(container.id)}
                  selectedContainers={selectedContainers}
                  handleSelect={handleSelect}
                  bgColor="!bg-bluegray-100"
                  shadow="!drop-shadow-xl"
                />
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
        <DragOverlay>
          <div className="max-w-screen overflow-hidden">
            {activeItem ? (
              activeItem.hasOwnProperty("parentContainerId") ? (
                <ContainerAccordion
                  container={activeItem}
                  handleChange={handleChange}
                  showLocation
                  openContainers={openContainers}
                  openContainerItems={openContainerItems}
                />
              ) : (
                <DraggableItemCard
                  item={activeItem}
                  overlay
                  bgColor="!bg-bluegray-100"
                  shadow="!drop-shadow-md"
                  mutationKey="containers"
                />
              )
            ) : null}
          </div>
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Nested;
