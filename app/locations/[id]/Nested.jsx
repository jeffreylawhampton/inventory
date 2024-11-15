import { useState, useEffect, useContext, act } from "react";
import ContainerAccordion from "@/app/components/ContainerAccordion";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import DraggableItemCard from "@/app/components/DraggableItemCard";
import MasonryContainer from "@/app/components/MasonryContainer";
import { sortObjectArray, unflattenArray } from "@/app/lib/helpers";
import {
  moveItem,
  moveContainerToContainer,
  removeFromContainer,
} from "../api/db";
import toast from "react-hot-toast";
import { LocationAccordionContext } from "./layout";
import EmptyCard from "@/app/components/EmptyCard";

const Nested = ({
  data,
  items,
  setItems,
  handleAdd,
  mutate,
  handleItemFavoriteClick,
  handleContainerFavoriteClick,
  setShowCreateItem,
  setShowCreateContainer,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [results, setResults] = useState([]);

  const {
    openContainers,
    setOpenContainers,
    openContainerItems,
    setOpenContainerItems,
  } = useContext(LocationAccordionContext);
  useEffect(() => {
    setResults(sortObjectArray(unflattenArray(data?.containers)));
    setItems(sortObjectArray(data?.items));
  }, [data]);

  const handleAwaitOpen = async (destination, source) => {
    if (!openContainers?.includes(destination?.name)) {
      setOpenContainers([...openContainers, destination?.name]);
    }
    if (
      !openContainerItems?.includes(destination?.name) &&
      source?.type === "item"
    ) {
      setOpenContainerItems([...openContainerItems, destination?.name]);
    }
  };

  const handleResetItems = () => {
    setItems(sortObjectArray(data?.items));
    return setActiveItem(null);
  };

  const handleResetContainers = () => {
    setResults(sortObjectArray(unflattenArray(data.containers)));
    return setActiveItem(null);
  };

  const handleResetAll = () => {
    setItems(sortObjectArray(data?.items));
    setResults(sortObjectArray(unflattenArray(data.containers)));
    return setActiveItem(null);
  };

  function handleDragStart(event) {
    const active = event.active.data.current.item;
    setActiveItem(active);
    if (active.type === "item") {
      setItems(items?.filter((i) => i.id != active.id));
    } else {
      const updated = data?.containers?.filter(
        (con) => con.id != event.active.data.current.item.id
      );
      setResults(sortObjectArray(unflattenArray(updated)));
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    const destination = over?.data?.current?.item;
    const source = activeItem;
    await handleAwaitOpen(destination, source);
    setActiveItem(null);
    if (source.type === "container") {
      if (
        (destination?.type === "container" &&
          source.parentContainerId === destination.id) ||
        (destination?.type === "container" && source.id === destination?.id) ||
        (!destination && !source?.parentContainerId)
      ) {
        return handleResetContainers();
      }

      const updated = { ...data };
      const containerToUpdate = updated?.containers?.find(
        (con) => con.id === source.id
      );
      if (!destination) {
        containerToUpdate.parentContainerId = null;
        try {
          setResults(sortObjectArray(unflattenArray(updated?.containers)));
          return await mutate(
            removeFromContainer({ id: source.id, isContainer: true }),
            {
              optimisticData: updated,
              revalidate: true,
              rollbackOnError: true,
              populateCache: false,
            }
          );
        } catch (e) {
          toast.error("Something went wrong");
          throw new Error(e);
        }
      } else {
        containerToUpdate.parentContainerId = destination.id;
        try {
          setResults(sortObjectArray(unflattenArray(updated?.containers)));
          return await mutate(
            moveContainerToContainer({
              containerId: source.id,
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
        } catch (e) {
          toast.error("Something went wrong");
          throw new Error(e);
        }
      }
    }

    if (source.type === "item") {
      if (
        (destination?.type === "container" &&
          source?.containerId === destination.id) ||
        (!destination && !source.containerId)
      ) {
        return handleResetItems();
      }

      const updated = { ...data };
      if (!destination) {
        const oldContainer = updated?.containers?.find(
          (con) => con.id === source.containerId
        );
        oldContainer.items = oldContainer.items?.filter(
          (i) => i.id != source.id
        );
        updated.items.push(source);

        try {
          mutate(
            moveItem({
              itemId: source.id,
              destinationId: data.id,
              destinationType: "location",
              destinationLocationId: data.id,
            }),
            {
              optimisticData: updated,
              rollbackOnError: true,
              populateCache: false,
              revalidate: true,
            }
          );
          setItems(sortObjectArray([...items, source]));
          setResults(sortObjectArray(unflattenArray(updated?.containers)));
        } catch (e) {
          toast.error("Something went wrong");
          throw new Error(e);
        }
      } else {
        if (!source.containerId) {
          updated.items = updated.items?.filter((i) => i.id != source.id);
          const newContainer = updated.containers?.find(
            (con) => con.id === destination.id
          );
          newContainer.items.push(source);
        } else {
          const oldContainer = updated?.containers?.find(
            (con) => con.id === source.containerId
          );
          oldContainer.items = sortObjectArray(
            oldContainer.items?.filter((i) => i.id != source.id)
          );
          const newContainer = updated?.containers?.find(
            (con) => con.id === destination.id
          );
          newContainer.items.push(source);
        }
        await handleAwaitOpen(destination, source);
        try {
          setResults(sortObjectArray(unflattenArray(updated?.containers)));
          setItems(sortObjectArray([...items, source]));
          mutate(
            moveItem({
              itemId: source.id,
              destinationId: destination.id,
              destinationType: "container",
              destinationLocationId: data.id,
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
    }

    return handleResetAll();
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <DragOverlay>
        {activeItem ? (
          activeItem.type === "container" ? (
            <ContainerAccordion container={activeItem} />
          ) : (
            <DraggableItemCard
              item={activeItem}
              bgColor="!bg-bluegray-200"
              shadow="!drop-shadow-lg"
            />
          )
        ) : null}
      </DragOverlay>
      {data?.items?.length || data?.containers?.length ? (
        <MasonryContainer>
          {items?.map((item) => {
            return (
              <DraggableItemCard
                key={item?.name}
                activeItem={activeItem}
                item={item}
                bgColor="!bg-bluegray-200"
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
                handleItemFavoriteClick={handleItemFavoriteClick}
                handleContainerFavoriteClick={handleContainerFavoriteClick}
                openContainerItems={openContainerItems}
                openContainers={openContainers}
                setOpenContainerItems={setOpenContainerItems}
                setOpenContainers={setOpenContainers}
              />
            );
          })}
        </MasonryContainer>
      ) : (
        <EmptyCard
          move={handleAdd}
          add={setShowCreateItem}
          addContainer={setShowCreateContainer}
        />
      )}
    </DndContext>
  );
};

export default Nested;
