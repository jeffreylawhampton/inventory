"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { sortObjectArray } from "../lib/helpers";
import NewLocation from "./NewLocation";
import Droppable from "./Droppable";
import {
  DndContext,
  pointerWithin,
  DragOverlay,
  closestCenter,
  closestCorners,
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
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import LocationFilters from "./LocationFilters";
import ContainerAccordion from "../components/ContainerAccordion";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { IconExternalLink, IconX } from "@tabler/icons-react";
// import LocationFilters from "../containers/LocationFilters";
import Tooltip from "../components/Tooltip";
import { Button, Chip } from "@mantine/core";
import "./index.css";
import Link from "next/link";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data?.locations;
};

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState();
  const [activeItem, setActiveItem] = useState(null);
  const [filters, setFilters] = useSessionStorage(
    "filters",
    data?.map((loc) => loc.id)
  );

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const router = useRouter();

  // const {
  //   dimensions: { width },
  // } = useContext(DeviceContext);

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    filters?.includes(location.id.toString())
  );

  useEffect(() => {
    setFilters(data?.map((location) => location.id.toString()));
  }, [data]);

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

  // useEffect(() => {
  //   setFilters(data?.map((location) => location.id));
  //   setActiveFilters(data?.map((location) => location.id.toString()));
  // }, [data]);

  // const filteredResults = sortObjectArray(locationList).filter((location) =>
  //   activeFilters?.includes(location.id.toString())
  // );

  // const handleCheck = (id) => {
  //   console.log(id);
  //   if (activeFilters.includes(id.toString())) {
  //     setActiveFilters(activeFilters.filter((locationId) => locationId != id));
  //   } else {
  //     setActiveFilters([...activeFilters, id]);
  //   }
  // };

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
    <div className="top-0 pr-8 pb-6 xl:pr-12 max-lg:w-screen w-[92vw]">
      <h1 className="font-bold text-3xl pt-8 pb-3">Locations</h1>
      <LocationFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        locationList={locationList}
        filters={filters}
        setFilters={setFilters}
        handleCheck={handleCheck}
      />
      <div className="flex gap-2 !items-center flex-wrap">
        {/* <Chip.Group multiple value={activeFilters} onChange={setActiveFilters}>
          {locationList?.map((location) => {
            return (
              <Chip
                key={v4()}
                value={location.id.toString()}
                size="sm"
                variant="filled"
                classNames={{
                  label: "font-medium !text-[13px] lg:p-2",
                }}
              >
                {location?.name}
              </Chip>
            );
          })}
        </Chip.Group> */}
        {/* {activeFilters?.length > 1 ? (
          <button
            size="xs"
            variant="subtle"
            onClick={() => setActiveFilters([])}
          >
            Clear
          </button>
        ) : null} */}
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={pointerWithin}
        // modifiers={[restrictToWindowEdges]}
      >
        <div className="mt-2 bg-white dropContainer">
          {filteredResults.map((location) => {
            const combined = location?.items?.concat(location?.containers);
            return (
              <Droppable
                key={v4()}
                id={location.name}
                item={location}
                className="relative cursor-pointer flex flex-col gap-4 px-3 py-5 rounded-xl !overflow-x-hidden h-fit bg-bluegray-200 min-w-[440px]"
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
                        onClick={() => router.push(`/locations/${location.id}`)}
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
              </Droppable>
            );
          })}
        </div>

        <DragOverlay
          // modifiers={[snapCenterToCursor]}
          sensors={sensors}
          collisionDetection={pointerWithin}
        >
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
