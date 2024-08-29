"use client";
import { CircularProgress, useDisclosure } from "@nextui-org/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CreateNewButton from "../components/CreateNewButton";
import { sortObjectArray } from "../lib/helpers";
import MasonryContainer from "../components/MasonryContainer";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { v4 } from "uuid";
import {
  closestCenter,
  closestCorners,
  DndContext,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";
import ItemCard from "./Card";
import Container from "./Container";
import {
  moveItem,
  moveContainerToLocation,
  moveContainerToContainer,
} from "./api/db";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data.locations;
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [filter, setFilter] = useState("");
  const [parent, setParent] = useState(null);
  const [isDropped, setIsDropped] = useState(false);
  const [locations, setLocations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/locations/api");
      const data = await res.json();
      setLocations(data?.locations);
    };
    fetchData();
  }, []);

  const router = useRouter();

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    location?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const newLocations = locations.map((location) => {
      return { ...location };
    });
    // const destinationType = over.data.current.item.hasOwnProperty(
    //   "parentLocationId"
    // )
    //   ? "location"
    //   : "container";
    // const sourceType = active.data.current.item.hasOwnProperty(
    //   "parentContainerId"
    // )
    //   ? "container"
    //   : "item";
    const destination = newLocations.find(
      (loc) => loc.id == over.data.current.item.id
    );
    const source = active.data.current.item;
    const sourceType = source.hasOwnProperty("parentContainerId")
      ? "container"
      : "item";
    const destinationType = destination.hasOwnProperty("parentContainerId")
      ? "container"
      : "location";

    if (sourceType === "container" && destinationType === "location") {
      let newLocation = newLocations.find(
        (location) => location.id == over.data.current.item.id
      );
      console.log(newLocation.containers.includes(source));
      if (!newLocation.containers.includes(source)) {
        newLocation.containers.push(source);
        const oldLocation = newLocations.find(
          (loc) => loc.id == source.locationId
        );
        oldLocation.containers = oldLocation.containers.filter(
          (container) => container.name != source.name
        );
        setLocations(newLocations);
      }

      setActiveId(null);
      setActiveItem(null);
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

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setActiveItem(event.active.data.current.item);
  }

  //   function handleDragEnd(event) {
  //     const { active, over } = event;
  //     console.log(active, over);
  //     setActiveId(null);
  //   }

  console.log(locations);

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <MasonryContainer>
          {locations?.map((location) => {
            const combined = location?.items?.concat(location?.containers);
            return (
              <Droppable
                key={location.name}
                id={location.name}
                item={location}
                className="bg-gray-200 flex flex-col gap-2 p-6"
              >
                <h2>{location.name}</h2>
                {combined?.map((container) => {
                  return container.hasOwnProperty("parentContainerId") ? (
                    <Draggable
                      key={container.name}
                      id={container.name}
                      item={container}
                    >
                      <Container
                        container={container}
                        activeItem={activeItem}
                      />
                    </Draggable>
                  ) : (
                    <Draggable
                      key={container.name}
                      id={container.name}
                      item={container}
                    >
                      <ItemCard item={container} activeItem={activeItem} />
                    </Draggable>
                  );
                })}
              </Droppable>
            );
          })}
        </MasonryContainer>
        <DragOverlay>
          {activeItem ? (
            activeItem.hasOwnProperty("parentContainerId") ? (
              <Container container={activeItem} />
            ) : (
              <ItemCard item={activeItem} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
