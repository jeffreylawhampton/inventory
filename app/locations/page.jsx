"use client";
import { useState, useContext, useEffect } from "react";
import { toggleFavorite } from "@/app/lib/db";
import toast from "react-hot-toast";
import useSWR from "swr";
import NewLocation from "./NewLocation";
import { useDisclosure } from "@mantine/hooks";
import LocationFilters from "./LocationFilters";
import CreateButton from "../components/CreateButton";
import Loading from "@/app/components/Loading";
import { LocationContext } from "./layout";
import { DeviceContext } from "../layout";
import MasonryContainer from "../components/MasonryContainer";
import DraggableItemCard from "../components/DraggableItemCard";
import ContainerAccordion from "../components/ContainerAccordion";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import LocationAccordion from "../components/LocationAccordion";
import {
  moveContainerToLocation,
  moveContainerToContainer,
  moveItem,
} from "./api/db";

const fetcher = async () => {
  const res = await fetch(`/locations/api`);
  const data = await res.json();
  return data.locations;
};

const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [results, setResults] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const { setCrumbs } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(null);
  }, []);

  const {
    openLocations,
    setOpenLocations,
    openLocationItems,
    setOpenLocationItems,
    openContainers,
    setOpenContainers,
    openContainerItems,
    setOpenContainerItems,
    filters,
    setFilters,
  } = useContext(LocationContext);

  useEffect(() => {
    if (!filters?.length) {
      setFilters(data?.map((location) => location?.name));
    }

    data && setResults([...data]);
  }, [data]);

  const handleAwaitOpen = async (destination, source) => {
    if (destination.type === "container") {
      !openContainers?.includes(destination.name) &&
        setOpenContainers([...openContainers, destination.name]);
      if (
        source.type === "item" &&
        !openContainerItems?.includes(destination.name)
      ) {
        setOpenContainerItems([...openContainerItems, destination.name]);
      }
    } else {
      if (
        source.type === "item" &&
        !openLocationItems?.includes(destination.name)
      ) {
        setOpenLocationItems([...openLocationItems, destination.name]);
      }
      !openLocations?.includes(destination.name) &&
        setOpenLocations([...openLocations, destination.name]);
    }
  };

  const handleItemFavoriteClick = async (item) => {
    const add = !item.favorite;
    const newData = [...data];

    const location = newData.find(
      (location) => location.id === item.locationId
    );

    if (item?.containerId) {
      const container = location.containers?.find(
        (con) => con.id === item.containerId
      );
      const itemToUpdate = container?.items?.find((i) => i.name === item.name);
      itemToUpdate.favorite = add;
    } else {
      const itemToUpdate = location?.items?.find((i) => i.id === item.id);
      itemToUpdate.favorite = add;
    }

    try {
      setResults(newData);
      await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
        optimisticData: newData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleContainerFavoriteClick = async (container) => {
    const add = !container.favorite;
    const locations = [...results];
    const location = locations.find((loc) => loc.id === container.locationId);
    const containerToUpdate = location.containers.find(
      (i) => i.name === container.name
    );

    containerToUpdate.favorite = !container.favorite;
    try {
      setResults(locations);
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: locations,
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

  function handleDragStart(event) {
    const active = event.active.data.current.item;
    setActiveItem(active);
  }

  const handleDragEnd = async (event) => {
    const { over } = event;

    const destination = over?.data?.current?.item;
    const source = { ...activeItem };

    if (
      !destination ||
      (source?.type === destination?.type &&
        source.parentContainerId == destination.id) ||
      (source?.type === destination?.type && source.id == destination.id) ||
      (destination?.type === "location" &&
        source.type === "container" &&
        !source?.parentContainerId &&
        destination.id === source.locationId) ||
      (destination?.type === "container" &&
        destination.id === source?.containerId) ||
      (destination?.type === "location" &&
        source.type === "container" &&
        !source.parentContainerId &&
        source.locationId === destination.id)
    ) {
      return setActiveItem(null);
    }
    await handleAwaitOpen(destination, source);

    if (source.type === "item") {
      const updated = [...data];
      const oldLocation = updated?.find((l) => l.id === source.locationId);
      if (!source.containerId) {
        oldLocation.items = oldLocation.items?.filter((i) => i.id != source.id);
      } else {
        const oldContainer = oldLocation?.containers?.find(
          (c) => c.id === source.containerId
        );
        oldContainer.items = oldContainer?.items?.filter(
          (i) => i.id != source.id
        );
      }
      let newLocation;
      if (destination.type === "container") {
        newLocation = updated.find((l) => l.id === destination.locationId);
        const newContainer = newLocation.containers?.find(
          (c) => c.id === destination.id
        );
        newContainer.items.push(source);
      } else {
        newLocation = updated.find((l) => l.id === destination.id);
        newLocation.items.push(source);
      }
      try {
        mutate(
          moveItem({
            itemId: source.id,
            destinationId: destination.id,
            destinationType: destination.type,
            destinationLocationId:
              destination.type === "location"
                ? destination.id
                : destination.locationId,
          }),
          {
            optimisticData: updated,
            revalidate: true,
            rollbackOnError: true,
            populateCache: false,
          }
        );
        return setActiveItem(null);
      } catch (e) {
        toast.error("Something went wrong");
        throw new Error(e);
      }
    }

    if (source.type === "container") {
      if (destination.type === "location") {
        const updated = [...data];

        const oldLocation = updated?.find((l) => l.id === source.locationId);
        let container = oldLocation?.containers?.find(
          (c) => c.id === source.id
        );
        container.locationId = destination.id;
        container.parentContainerId = null;

        oldLocation.containers = oldLocation?.containers?.filter(
          (c) => c.id != source.id
        );
        const newLocation = updated?.find((l) => l.id === destination.id);

        newLocation && newLocation.containers?.push(source);

        try {
          mutate(
            moveContainerToLocation({
              containerId: source.id,
              locationId: destination.id,
            }),
            {
              optimisticData: updated,
              rollbackOnError: true,
              populateCache: false,
              revalidate: true,
            }
          );
          return setActiveItem(null);
        } catch (e) {
          toast.error("Something went wrong");
          throw new Error(e);
        }
      }

      if (destination.type === "container") {
        const optimistic = [...data];
        const oldLocation = optimistic.find(
          (loc) => loc.id === source.locationId
        );
        const containerToUpdate = oldLocation.containers?.find(
          (container) => container.id === source.id
        );
        if (containerToUpdate) {
          containerToUpdate.parentContainerId = destination.id;
          containerToUpdate.locationId = destination.locationId;
        }
        const newLocation = optimistic.find(
          (loc) => loc.id === destination.locationId
        );
        newLocation?.containers?.push(source);

        try {
          mutate(
            moveContainerToContainer({
              containerId: source.id,
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
          return setActiveItem(null);
        } catch (e) {
          toast.error("Something went wrong");
          throw new Error(e);
        }
      }
    }

    return setActiveItem(null);
  };

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  return (
    <div className="pb-8 mt-[-1.5rem]">
      <h1 className="font-bold text-3xl pb-6">Locations</h1>
      <LocationFilters
        locationList={data}
        filters={filters}
        setFilters={setFilters}
      />

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <DragOverlay>
          {activeItem?.type === "container" ? (
            <ContainerAccordion container={activeItem} />
          ) : (
            <DraggableItemCard item={activeItem} />
          )}
        </DragOverlay>

        <MasonryContainer>
          {results?.map((location) => {
            return filters?.includes(location.name) ? (
              <LocationAccordion
                key={location?.name}
                location={{ ...location }}
                bgColor="!bg-bluegray-200"
                activeItem={activeItem}
                handleItemFavoriteClick={handleItemFavoriteClick}
                handleContainerFavoriteClick={handleContainerFavoriteClick}
                openContainerItems={openContainerItems}
                openContainers={openContainers}
                setOpenContainerItems={setOpenContainerItems}
                setOpenContainers={setOpenContainers}
                itemCount={location?._count?.items}
                containerCount={location?._count?.containers}
              />
            ) : null;
          })}
        </MasonryContainer>
      </DndContext>

      <NewLocation opened={opened} close={close} locationList={data} />

      <CreateButton tooltipText="Create new location" onClick={open} />
    </div>
  );
};

export default Page;
