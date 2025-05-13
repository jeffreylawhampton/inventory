import { useContext, useState } from "react";
import ItemsAccordion from "./ItemAccordion";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import {
  IconChevronDown,
  IconExternalLink,
  IconCircle,
  IconCircleMinus,
} from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import { sortObjectArray, buildContainerTree } from "../lib/helpers";
import LocationContainerAccordion from "./LocationContainerAccordion";
import { LocationContext } from "../layout";
import { cardStyles } from "../lib/styles";

const LocationAccordion = ({
  location,
  activeItem,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  isSelected,
  handleSelect,
  showDelete,
}) => {
  const [bgColor, setBgColor] = useState(cardStyles.defaultBg);

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

  const hasChildren = location?._count?.containers || location?._count?.items;

  const unflattened = sortObjectArray(buildContainerTree(location.containers));

  return (
    <div
      ref={setNodeRef}
      onClick={showDelete ? () => handleSelect(location.id) : null}
      className={`border-2 ${
        showDelete
          ? !isSelected
            ? "opacity-50"
            : "border-danger-500 box-content"
          : ""
      } ${bgColor} rounded-xl ${isOver ? "brightness-90" : ""}`}
    >
      <div className=" w-full rounded-xl pt-1 pb-2 px-4 relative @container">
        <div className="flex w-full justify-between items-center my-3">
          {showDelete ? (
            <h3 className="font-semibold text-xl pl-2">{location.name}</h3>
          ) : (
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
          )}

          {showDelete ? (
            <div className="my-2">
              {isSelected ? (
                <IconCircleMinus
                  className="text-white bg-danger rounded-full w-7 h-7"
                  aria-label="Container unselected"
                />
              ) : (
                <IconCircle
                  className="text-bluegray-700 opacity-50 w-7 h-7"
                  aria-label="Container selected"
                />
              )}
            </div>
          ) : (
            <div
              className="flex gap-2 my-2 pl-2 items-center"
              onClick={handleLocationClick}
              onMouseEnter={
                hasChildren ? () => setBgColor(cardStyles.hoverBg) : null
              }
              onMouseLeave={
                hasChildren ? () => setBgColor(cardStyles.defaultBg) : null
              }
            >
              <CountPills
                onClick={handleLocationClick}
                containerCount={location._count?.containers}
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
          )}
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
