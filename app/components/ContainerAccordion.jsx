import { useState } from "react";
import { Collapse, Space } from "@mantine/core";
import {
  getTextClass,
  sortObjectArray,
  truncateName,
  hexToHSL,
} from "../lib/helpers";
import Droppable from "./Droppable";
import Tooltip from "./Tooltip";
import Draggable from "./Draggable";
import DraggableItemCard from "./DraggableItemCard";
import DeleteSelector from "./DeleteSelector";
import {
  IconExternalLink,
  IconChevronDown,
  IconMapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import ItemCountPill from "./ItemCountPill";
import { v4 } from "uuid";
import IconPill from "./IconPill";

const ContainerAccordion = ({
  container,
  activeItem,
  bgColor,
  shadow,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  showLocation,
  openContainers,
  setOpenContainers,
  openContainerItems,
  setOpenContainerItems,
  isSelected,
  handleSelect,
  showDelete,
  selectedContainers,
}) => {
  const hoverColor = hexToHSL(container?.color?.hex || "#ececec", 8);
  const activeColor = hexToHSL(container?.color?.hex || "#dddddd", 12);
  const [currentColor, setCurrentColor] = useState(container?.color?.hex);
  const [shadowSize, setShadowSize] = useState("!shadow-md");

  const isOpen = openContainers?.includes(container?.name);
  const itemsOpen = openContainerItems?.includes(container?.name);

  const handleMouseDown = () => {
    setShadowSize("!shadow-sm");
    setCurrentColor(activeColor);
  };

  const handleMouseUp = () => {
    setShadowSize("!shadow-md");
    setCurrentColor(container?.color?.hex);
  };

  const handleContainerClick = () => {
    setOpenContainers(
      openContainers?.includes(container.name)
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  const handleToggleItems = () => {
    setOpenContainerItems(
      itemsOpen
        ? openContainerItems?.filter((con) => con != container.name)
        : [...openContainerItems, container.name]
    );
  };

  if (container?.items) {
    container.items = sortObjectArray(container.items);
  }
  return (
    <Draggable id={container.id} item={container} activeItem={activeItem}>
      <Droppable id={container.id} item={container}>
        <div
          className={`bg-gray-200 ${shadowSize} rounded-lg group relative @container ${
            container.name === activeItem?.name && "hidden"
          }`}
        >
          <div
            className={`${getTextClass(
              container?.color?.hex
            )} @container transition-all relative flex flex-col @sm:flex-row gap-x-2 items-start @sm:items-center w-full justify-between pr-3 py-2 pl-9 rounded-t-lg ${
              isOpen ? "rounded-b-sm" : "rounded-b-lg"
            } ${showDelete ? (!isSelected ? "opacity-40" : "") : null}`}
            style={{ backgroundColor: currentColor }}
          >
            {showDelete ? (
              <div
                className="absolute w-full h-full top-0 left-0"
                onClick={() => handleSelect(container.id)}
              />
            ) : null}
            <h2
              className={`${getTextClass(
                container?.color?.hex
              )} group-active:!shadow-sm @sm:w-2/5 break-words text-pretty hyphens-auto !leading-tight font-semibold !text-sm`}
            >
              {showDelete ? (
                truncateName(container.name)
              ) : (
                <Link
                  prefetch={false}
                  onMouseEnter={() => setCurrentColor(hoverColor)}
                  onMouseLeave={() => setCurrentColor(container?.color?.hex)}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  href={`/containers/${container.id}`}
                >
                  {truncateName(container.name)}{" "}
                </Link>
              )}
            </h2>
            <div
              className={`flex min-w-1/2 gap-1 pl-0 @sm:pl-2 py-2 items-center ${getTextClass(
                container?.color?.hex
              )}`}
            >
              {showDelete ? (
                <DeleteSelector
                  iconSize={24}
                  isSelectedForDeletion={isSelected}
                />
              ) : (
                <CountPills
                  handleContainerClick={handleContainerClick}
                  containerCount={container.containerCount}
                  itemCount={container.itemCount}
                  textClasses="text-sm"
                  transparent
                  showContainers
                  showItems
                  showFavorite
                  handleFavoriteClick={handleContainerFavoriteClick}
                  item={container}
                  showDelete={showDelete}
                  isSelected={isSelected}
                />
              )}

              <IconChevronDown
                onClick={handleContainerClick}
                className={`relative hover:scale-125 cursor-pointer transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          <Collapse in={isOpen}>
            <div
              className={`w-full rounded-b-lg p-3 bg-bluegray-300 `}
              style={{
                backgroundColor: `${container?.color?.hex}${
                  isSelected ? "66" : "33"
                }`,
              }}
            >
              <div
                className={`flex items-center justify-between p-2 w-fit mb-2 gap-1 ${
                  showDelete ? (isSelected ? "" : "opacity-30") : null
                }`}
              >
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
                    prefetch={false}
                    className="bg-white bg-opacity-20 hover:bg-opacity-40 px-4 py-1 h-[27px] rounded-full"
                    href={`/containers/${container.id}`}
                  >
                    <IconExternalLink
                      size={18}
                      aria-label="Go to container page"
                    />
                  </Link>
                </Tooltip>
                {showLocation && container?.locationId ? (
                  <IconPill
                    name={container?.location?.name}
                    icon={<IconMapPin size={18} />}
                    href={`/locations?type=location&${container?.locationId}`}
                    bgClasses="bg-white/20 hover:bg-white/40 active:bg-white-60 py-1.5"
                  />
                ) : null}
              </div>
              <Collapse in={itemsOpen}>
                <div className="flex flex-col gap-2">
                  {container?.items?.map((item) => {
                    return activeItem?.id === item.id ? null : (
                      <DraggableItemCard
                        item={item}
                        activeItem={activeItem}
                        key={v4()}
                        bgColor="bg-white"
                        shadow={shadow}
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
                      <ContainerAccordion
                        container={childContainer}
                        first={false}
                        key={childContainer.name}
                        activeItem={activeItem}
                        openContainers={openContainers}
                        setOpenContainers={setOpenContainers}
                        openContainerItems={openContainerItems}
                        setOpenContainerItems={setOpenContainerItems}
                        handleContainerClick={handleContainerClick}
                        handleContainerFavoriteClick={
                          handleContainerFavoriteClick
                        }
                        handleItemFavoriteClick={handleItemFavoriteClick}
                        bgColor={bgColor}
                        showLocation={showLocation}
                        isSelected={selectedContainers?.includes(
                          childContainer.id
                        )}
                        handleSelect={handleSelect}
                        showDelete={showDelete}
                        selectedContainers={selectedContainers}
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

export default ContainerAccordion;
