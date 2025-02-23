import { useState } from "react";
import { Collapse, Space } from "@mantine/core";
import {
  getTextClass,
  sortObjectArray,
  getCounts,
  truncateName,
  hexToHSL,
} from "../lib/helpers";
import Droppable from "./Droppable";
import Tooltip from "./Tooltip";
import Draggable from "./Draggable";
import DraggableItemCard from "./DraggableItemCard";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import ItemCountPill from "./ItemCountPill";
import LocationPill from "./LocationPill";

const LocationContainerAccordion = ({
  container,
  activeItem,
  bgColor,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  showLocation,
  openContainers,
  setOpenContainers,
  openContainerItems,
  setOpenContainerItems,
}) => {
  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex || "#dddddd", 8);
  const activeColor = hexToHSL(container?.color?.hex, 12);

  const isOpen = openContainers?.includes(container?.name);
  const itemsOpen = openContainerItems?.includes(container?.name);
  const handleContainerClick = () => {
    setOpenContainers(
      isOpen
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  const { containerCount, itemCount } = getCounts(container);

  if (container?.items) {
    container.items = sortObjectArray(container.items);
  }

  const handleToggleItems = () => {
    setOpenContainerItems(
      itemsOpen
        ? openContainerItems?.filter((con) => con != container.name)
        : [...openContainerItems, container.name]
    );
  };

  return activeItem?.name === container.name ? null : (
    <Draggable id={container.id} item={container}>
      <Droppable id={container.id} item={container}>
        <div className="bg-gray-200 rounded-lg shadow-md active:shadow-sm relative @container">
          <div
            className={`${getTextClass(
              container?.color?.hex
            )}  @container transition-all flex flex-col @sm:flex-row gap-x-2 items-start @sm:items-center w-full justify-between pr-3 py-2 pl-10 rounded-t-lg ${
              isOpen ? "rounded-b-sm" : "rounded-b-lg"
            }`}
            style={{ backgroundColor: currentColor }}
            onMouseEnter={() => setCurrentColor(hoverColor)}
            onMouseLeave={() => setCurrentColor(container?.color?.hex)}
            onMouseDown={() => setCurrentColor(activeColor)}
          >
            <Link
              className={`${getTextClass(
                container?.color?.hex
              )} @sm:w-2/5 break-words text-pretty hyphens-auto !leading-tight font-semibold text-sm @3xl:text-md`}
              href={`/containers/${container.id}`}
            >
              {truncateName(container.name)}
            </Link>

            <div
              className={`flex min-w-1/2 gap-1 pl-0 @sm:pl-2 py-2 items-center ${getTextClass(
                container?.color?.hex
              )}`}
              onMouseEnter={() => setCurrentColor(container?.color?.hex)}
              onMouseLeave={() => setCurrentColor(hoverColor)}
            >
              <CountPills
                handleContainerClick={handleContainerClick}
                containerCount={containerCount}
                itemCount={itemCount}
                textClasses="text-sm"
                transparent
                showContainers
                showItems
                showFavorite
                handleFavoriteClick={handleContainerFavoriteClick}
                item={container}
              />

              <IconChevronDown
                onClick={handleContainerClick}
                className={`cursor-pointer transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          <Collapse in={isOpen}>
            <div
              className="w-full rounded-b-lg p-3 bg-bluegray-300"
              style={{ backgroundColor: `${container?.color?.hex}33` }}
            >
              <div className="flex items-center justify-between p-2 w-fit mb-2 gap-1">
                <div
                  onClick={container.items?.length ? handleToggleItems : null}
                >
                  <ItemCountPill
                    isOpen={itemsOpen}
                    itemCount={container.items?.length}
                    transparent
                  />
                </div>
                <Tooltip label="Go to container page" position="top">
                  <Link
                    className="bg-white bg-opacity-20 hover:bg-opacity-40 px-4 py-1 h-[27px] rounded-full"
                    href={`/containers/${container.id}`}
                  >
                    <IconExternalLink
                      size={18}
                      aria-label="Go to container page"
                    />
                  </Link>
                </Tooltip>
                {showLocation ? (
                  <LocationPill
                    locationName={container?.location?.name}
                    locationId={container?.location?.id}
                  />
                ) : null}
              </div>
              <Collapse in={itemsOpen}>
                <div className="flex flex-col gap-2">
                  {container?.items?.map((item) => {
                    return (
                      <DraggableItemCard
                        item={item}
                        activeItem={activeItem}
                        key={item.name}
                        handleItemFavoriteClick={handleItemFavoriteClick}
                      />
                    );
                  })}
                  <Space h={12} />
                </div>
              </Collapse>
              <div className="flex flex-col gap-3">
                {container?.containers &&
                  sortObjectArray(container.containers).map(
                    (childContainer) => (
                      <LocationContainerAccordion
                        container={childContainer}
                        first={false}
                        key={childContainer.name}
                        activeItem={activeItem}
                        handleContainerClick={handleContainerClick}
                        handleContainerFavoriteClick={
                          handleContainerFavoriteClick
                        }
                        handleItemFavoriteClick={handleItemFavoriteClick}
                        bgColor={bgColor}
                        openContainers={openContainers}
                        setOpenContainers={setOpenContainers}
                        openContainerItems={openContainerItems}
                        setOpenContainerItems={setOpenContainerItems}
                      />
                    )
                  )}
              </div>
            </div>
          </Collapse>
        </div>
      </Droppable>
    </Draggable>
  );
};

export default LocationContainerAccordion;
