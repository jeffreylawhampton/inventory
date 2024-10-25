"use client";
import useSWR from "swr";
import { useEffect, useState, useContext } from "react";
import { sortObjectArray } from "../lib/helpers";
import NewLocation from "./NewLocation";
import {
  DndContext,
  pointerWithin,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableItemCard from "../components/DraggableItemCard";
import {
  moveItem,
  moveContainerToLocation,
  moveContainerToContainer,
} from "./api/db";
import Loading from "../components/Loading";
import { useDisclosure, useSessionStorage } from "@mantine/hooks";
import CreateButton from "../components/CreateButton";
import LocationFilters from "./LocationFilters";
import ContainerAccordion from "../components/ContainerAccordion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import LocationAccordion from "../components/LocationAccordion";
import { AccordionContext } from "../layout";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data?.locations;
};

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [showFilters, setShowFilters] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [filters, setFilters] = useSessionStorage(
    "filters",
    data?.map((loc) => loc.id)
  );

  const {
    setOpenLocationItems,
    openLocations,
    setOpenLocations,
    openContainers,
    setOpenContainers,
  } = useContext(AccordionContext);

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  useEffect(() => {
    setFilters(data?.map((location) => location.id?.toString()));
    setOpenLocationItems(data?.map((location) => location.name));
  }, [data]);

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    filters?.includes(location.id?.toString())
  );

  const handleFavoriteClick = async (container) => {
    const add = !container.favorite;
    const locations = [...data];
    const location = locations.find((loc) => loc.id === container.locationId);

    const containerArray = [...location.containers];
    if (!container.parentContainerId) {
      const containerToUpdate = containerArray.find(
        (i) => i.name === container.name
      );
      containerToUpdate.favorite = !container.favorite;
    }

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: data,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleCheck = (locId) => {
    setFilters((prev) =>
      prev?.includes(locId)
        ? prev?.filter((loc) => loc != locId)
        : [...prev, locId]
    );
  };

  const handleX = (locId) => {
    setFilters((prev) => prev.filter((loc) => loc != locId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over?.data) {
      setActiveItem(null);
      return;
    }
    const destination = over.data.current.item;
    const source = active.data.current.item;

    if (
      (source?.type === destination?.type &&
        source.parentContainerId == destination.id) ||
      (source.type === destination?.type && source.id == destination.id)
    ) {
      return setActiveItem(null);
    }

    // todo: expand logic to handle all cancel scenarios

    if (source.type === "item") {
      if (
        !destination ||
        (destination?.type === "location" &&
          !source?.containerId &&
          destination.id === source.locationId) ||
        (destination.type === "container" &&
          destination.id === source.containerId)
      ) {
        return setActiveItem(null);
      } else {
        await mutate(
          moveItem({
            itemId: source.id,
            destinationType: destination.type,
            destinationId: destination.id,
            destinationLocationId:
              destination.type === "container" ? destination.locationId : null,
          })
        );
        if (
          destination?.type === "location" &&
          !openLocations?.includes(destination?.name)
        ) {
          setOpenLocations([...openLocations, destination.name]);
        }
        if (
          destination?.type === "container" &&
          openContainers?.includes(destination?.name)
        ) {
          setOpenContainers([...openContainers, destination.name]);
        }
      }
    }

    if (destination.type === "location") {
      if (
        (source.type === "item" && destination.id === source.locationId) ||
        (source.type === "container" &&
          !source.parentContainerId &&
          source.locationId === destination.id)
      )
        return setActiveItem(null);

      if (source.type === "container") {
        await mutate(
          moveContainerToLocation({
            containerId: source.id,
            locationId: destination.id,
          })
        );
        if (openLocations?.includes(destination.name))
          setOpenLocations([...openLocations, destination.name]);
      }
    } else {
      if (destination.type === "container" && source.type === "container") {
        await mutate(
          moveContainerToContainer({
            containerId: source.id,
            newContainerId: destination.id,
            newContainerLocationId: destination.locationId,
          })
        );

        if (!openContainers?.includes(destination.name))
          setOpenContainers([...openContainers, destination.name]);
      }
    }
    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div className="py-8">
      <h1 className="font-bold text-3xl mb-3">Locations</h1>
      <LocationFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        locationList={locationList}
        filters={filters}
        setFilters={setFilters}
        handleCheck={handleCheck}
      />
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
        sensors={sensors}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            840: 2,
            1400: 3,
            1800: 4,
          }}
        >
          <Masonry className=" grid-flow-col-dense grow pb-32" gutter={16}>
            {filteredResults.map((location) => {
              return (
                <LocationAccordion
                  location={location}
                  key={location.name}
                  activeItem={activeItem}
                  setFilters={setFilters}
                  handleX={handleX}
                  handleFavoriteClick={handleFavoriteClick}
                />
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

        <DragOverlay>
          {activeItem ? (
            activeItem.hasOwnProperty("parentContainerId") ? (
              <ContainerAccordion container={activeItem} dragging />
            ) : (
              <DraggableItemCard
                item={activeItem}
                overlay
                bgColor="!bg-bluegray-100"
                shadow="!drop-shadow-md"
              />
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      <NewLocation opened={opened} close={close} locationList={locationList} />

      <CreateButton tooltipText="Create new location" onClick={open} />
    </div>
  );
}
