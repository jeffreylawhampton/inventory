import { useContext, useState } from "react";
import { Collapse, Space } from "@mantine/core";
import {
  getTextClass,
  sortObjectArray,
  hexToHSL,
  getTextColor,
  checkSelected,
} from "../lib/helpers";
import {
  ContainerListItemCard,
  CountPills,
  DeleteSelector,
  Draggable,
  Droppable,
  IconPill,
  ItemCountPill,
  LucideIcon,
  Tooltip,
} from ".";
import { ExternalLink, ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";
import { v4 } from "uuid";
import { AccordionContext, ModalContext } from "../providers";

const ContainerAccordion = ({
  container,
  data,
  activeItem,
  bgColor,
  handleContainerFavoriteClick,
  handleEditItemClick,
  handleItemFavoriteClick,
  handleDeleteItemClick,
  handleContainerClick,
  showLocation,
  handleClick,
  parentDisabled = false,
  isOverlay = false,
  mutateKey,
}) => {
  const { showDelete } = useContext(ModalContext);
  const {
    openContainers,
    openContainerItems,
    setOpenContainerItems,
    selectedObjects,
  } = useContext(AccordionContext);

  const hoverColor = hexToHSL(container?.color?.hex || "#ececec", 8);
  const [currentColor, setCurrentColor] = useState(container?.color?.hex);
  const [shadowSize, setShadowSize] = useState("!shadow-md");

  const isOpen = openContainers?.includes(container?.name);
  const itemsOpen = openContainerItems?.includes(container?.name);

  const isSelected = checkSelected(container, selectedObjects);

  const disabled = parentDisabled;

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

  const textClass =
    showDelete && isSelected
      ? "text-white"
      : getTextClass(container?.color?.hex);

  const textColor =
    isSelected && showDelete ? "white" : getTextColor(container?.color?.hex);

  return activeItem?.name === container.name ? null : (
    <Draggable
      id={container.id}
      item={container}
      type="container"
      color={textColor}
      top="top-5"
      left="left-2.5"
      disabled={showDelete}
      isOverlay={isOverlay}
    >
      <Droppable id={container.id} item={container} disabled={disabled}>
        <div
          className={`transition-all bg-gray-200 ${shadowSize} rounded overflow-hidden group relative @container ${textClass} ${
            container.name === activeItem?.name && "hidden"
          }`}
        >
          <div
            className={`@container transition-all relative flex flex-col @sm:flex-row gap-x-2 items-start @sm:items-center w-full justify-between px-4 py-2 rounded-t ${
              showDelete ? (!isSelected ? "opacity-40" : "") : null
            }`}
            style={{
              backgroundColor:
                showDelete && isSelected
                  ? "var(--mantine-color-danger-5)"
                  : currentColor,
            }}
          >
            <div
              className="absolute w-full h-full top-0 left-0"
              onClick={() => handleClick(container)}
              onMouseEnter={() => setCurrentColor(hoverColor)}
              onMouseLeave={() => setCurrentColor(container?.color?.hex)}
            />

            <div className="flex gap-2 items-center w-full pt-1.5 pb-0.5 @sm:pt-0">
              <LucideIcon
                iconName={container?.icon}
                type="container"
                fill="none"
                stroke={textColor}
                size={18}
              />
              <h2
                className={`group-active:!shadow-sm w-full @sm:w-2/5 break-words text-pretty hyphens-auto !leading-tight font-semibold !text-sm truncate`}
              >
                {container.name}
              </h2>
            </div>
            <div
              className={`flex min-w-1/2 gap-1 pl-0 @sm:pl-2 py-2 items-center`}
            >
              {showDelete ? (
                <DeleteSelector isSelectedForDeletion={isSelected} />
              ) : (
                <CountPills
                  handleContainerClick={() => handleContainerClick(container)}
                  containerCount={container.containerCount}
                  itemCount={container.itemCount}
                  textClasses="text-sm"
                  transparent
                  showContainers
                  showItems
                  showFavorite
                  handleFavoriteClick={handleContainerFavoriteClick}
                  item={container}
                  isSelected={isSelected}
                />
              )}

              <ChevronDown
                onClick={() => handleContainerClick(container)}
                className={`relative hover:scale-125 cursor-pointer transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          <Collapse in={isOpen}>
            <div
              className={`w-full rounded-b p-3 bg-bluegray-300`}
              style={{
                backgroundColor:
                  showDelete && isSelected
                    ? "var(--mantine-color-danger-1)"
                    : `${container?.color?.hex}${isSelected ? "66" : "33"}`,
              }}
            >
              <div
                className={`text-black flex items-center justify-between p-2 w-fit mb-2 gap-1 ${
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
                    <ExternalLink size={18} aria-label="Go to container page" />
                  </Link>
                </Tooltip>
                {showLocation && container?.locationId ? (
                  <IconPill
                    name={container?.location?.name}
                    icon={<MapPin size={18} />}
                    href={`/locations?type=location&${container?.locationId}`}
                    bgClasses="bg-white/20 hover:bg-white/40 active:bg-white-60 py-1.5"
                  />
                ) : null}
              </div>

              <Collapse in={itemsOpen}>
                <div className="flex flex-col gap-2">
                  {container?.items?.map((item) => {
                    return activeItem?.id === item.id ? null : (
                      <ContainerListItemCard
                        item={item}
                        data={data}
                        activeItem={activeItem}
                        key={v4()}
                        handleItemFavoriteClick={handleItemFavoriteClick}
                        handleEditClick={handleEditItemClick}
                        handleClick={handleClick}
                        handleDeleteClick={handleDeleteItemClick}
                        mutateKey={mutateKey}
                        hideTags
                        showLocation={false}
                        isSelected={checkSelected(item, selectedObjects)}
                        isAccordion
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
                        data={data}
                        mutateKey={mutateKey}
                        first={false}
                        key={childContainer.name}
                        activeItem={activeItem}
                        handleContainerClick={handleContainerClick}
                        handleClick={handleClick}
                        handleContainerFavoriteClick={
                          handleContainerFavoriteClick
                        }
                        handleItemFavoriteClick={handleItemFavoriteClick}
                        handleEditItemClick={handleEditItemClick}
                        handleDeleteItemClick={handleDeleteItemClick}
                        bgColor={bgColor}
                        showLocation={showLocation}
                        parentDisabled={disabled || !isOpen}
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
