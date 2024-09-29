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

  const { setOpenLocationItems } = useContext(AccordionContext);

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  useEffect(() => {
    setFilters(data?.map((location) => location.id.toString()));
    setOpenLocationItems(data?.map((location) => location.name));
  }, [data]);

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    filters?.includes(location.id.toString())
  );

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

    console.log(source, destination);

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
        console.log("here", destination.type);
        await mutate(
          moveItem({
            itemId: source.id,
            destinationType: destination.type,
            destinationId: destination.id,
            destinationLocationId:
              destination.type === "container" ? destination.locationId : null,
          })
        );
      }
    }

    if (destination.type === "location") {
      console.log("here again");
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
      }
    } else if (source.type === "item") {
    } else {
      destination.type === "container"
        ? await mutate(
            moveContainerToContainer({
              containerId: source.id,
              newContainerId: destination.id,
              newContainerLocationId: destination.locationId,
            })
          )
        : await mutate(
            moveContainerToLocation({
              containerId: source.id,
              locationId: destination.id,
            })
          );
    }
    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div className="pb-32">
      <h1 className="font-bold text-3xl pt-4 mb-3">Locations</h1>
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
        {/* <ResponsiveMasonry
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
                <Location
                  location={location}
                  activeItem={activeItem}
                  setFilters={setFilters}
                />
              );
            })}
          </Masonry>
        </ResponsiveMasonry> */}

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

{
  /* <Droppable
                  key={v4()}
                  id={location.name}
                  item={location}
                  className="relative cursor-pointer flex flex-col gap-4 px-3 py-5 rounded-xl min-h-[300px]  overlay-y scroll-smooth !overflow-x-hidden bg-bluegray-200 hover:bg-bluegray-300"
                >
                  <div className="flex w-full justify-between items-center">
                    <Tooltip
                      label={`Go to ${location?.name}`}
                      delay={300}
                      position="top"
                    >
                      <h2 className="font-semibold text-xl flex gap-2 items-center hover:scale-(110%) transition-all">
                        {location.name}
                        <IconExternalLink
                          aria-label={`Go to ${location?.name}`}
                          onClick={() =>
                            router.push(`/locations/${location.id}`)
                          }
                        />
                      </h2>
                    </Tooltip>

                    <div className="flex gap-2">
                      <Tooltip label="Hide" delay={700} position="top">
                        <IconX
                          aria-label={`Close ${location?.name}`}
                          className="hover:scale-[115%] transition-all"
                          onClick={() => handleX(location.id)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {combined?.map((container) => {
                    return container.hasOwnProperty("parentContainerId") ? (
                      <ContainerAccordion
                        key={container.name}
                        container={container}
                        activeItem={activeItem}
                      />
                    ) : (
                      <DraggableItemCard
                        key={container.name}
                        item={container}
                        id={container.name}
                        activeItem={activeItem}
                        bgColor="!bg-bluegray-100"
                      />
                    );
                  })}
                </Droppable> */
}
