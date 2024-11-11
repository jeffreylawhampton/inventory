import { useContext, useState } from "react";
import ItemsAccordion from "./ItemAccordion";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import { IconChevronDown, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import { sortObjectArray, getCounts, unflattenArray } from "../lib/helpers";
import { LocationContext } from "../locations/layout";
import LocationContainerAccordion from "./LocationContainerAccordion";

const LocationAccordion = ({
  location,
  activeItem,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  itemCount,
  containerCount,
}) => {
  const {
    openLocations,
    setOpenLocations,
    openLocationItems,
    setOpenLocationItems,
    openContainerItems,
    setOpenContainerItems,
    openContainers,
    setOpenContainers,
  } = useContext(LocationContext);
  location = { ...location, type: "location" };
  const { isOver, setNodeRef } = useDroppable({
    id: location.id,
    data: { item: location },
  });

  const handleLocationClick = () => {
    setOpenLocations(
      openLocations?.includes(location.name)
        ? openLocations?.filter((name) => name != location.name)
        : [...openLocations, location.name]
    );
  };

  const isOpen = openLocations?.includes(location.name);

  const unflattened = sortObjectArray(unflattenArray(location.containers));

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl ${isOver ? "brightness-75" : ""}`}
    >
      <div className="bg-bluegray-200 w-full rounded-xl pt-2 pb-3 px-4 relative @container">
        <div className="flex w-full justify-between items-center my-3">
          <Link
            className=" items-center w-fit hover:text-primary-500 font-semibold text-xl pl-2"
            href={`/locations/${location.id}`}
          >
            {location.name}{" "}
            <IconExternalLink
              size={18}
              aria-label="Go to location page"
              className="inline mt-[-2px]"
            />
          </Link>

          <div
            className="flex gap-2 my-2 pl-2 items-center"
            onClick={handleLocationClick}
          >
            <CountPills
              onClick={handleLocationClick}
              containerCount={location._count.containers}
              itemCount={location._count?.items}
              showContainers
              showItems
            />
            {location?.items?.length || location.containers?.length ? (
              <IconChevronDown
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            ) : null}
          </div>
        </div>

        <Collapse in={openLocations?.includes(location.name)}>
          <div className="flex flex-col gap-2 mb-3">
            {location?.items?.length ? (
              <ItemsAccordion
                items={location?.items}
                activeItem={activeItem}
                location={location.name}
                handleItemFavoriteClick={handleItemFavoriteClick}
                openLocationItems={openLocationItems}
                setOpenLocationItems={setOpenLocationItems}
              />
            ) : null}

            {unflattened?.map((container) => {
              return (
                <LocationContainerAccordion
                  container={container}
                  activeItem={activeItem}
                  key={container.name}
                  showLocation
                  handleItemFavoriteClick={handleItemFavoriteClick}
                  handleContainerFavoriteClick={handleContainerFavoriteClick}
                  openContainers={openContainers}
                  setOpenContainers={setOpenContainers}
                  openContainerItems={openContainerItems}
                  setOpenContainerItems={setOpenContainerItems}
                />
              );
            })}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default LocationAccordion;
