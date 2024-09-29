import { Accordion, Button, Collapse, ScrollArea, Space } from "@mantine/core";
import { getFontColor, sortObjectArray } from "../lib/helpers";
import Droppable from "../components/Droppable";
import Tooltip from "../components/Tooltip";
import Draggable from "../components/Draggable";
import DraggableItemCard from "./DraggableItemCard";
import { useContext } from "react";
import { AccordionContext } from "../layout";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { DragHandle } from "../assets/DragHandle";

const Container = ({
  container,
  activeItem,
  first = true,
  bgColor,
  shadow,
}) => {
  const { openContainers, setOpenContainers, itemsVisible, setItemsVisible } =
    useContext(AccordionContext);
  const fontColor = getFontColor(container?.color?.hex);
  const isOpen = openContainers?.includes(container?.name);

  const handleContainerClick = (container) => {
    setOpenContainers(
      openContainers?.includes(container.name)
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  const handleItemsClick = () => {
    setItemsVisible(
      itemsVisible?.includes(container.name)
        ? itemsVisible.filter((name) => name != container.name)
        : [...itemsVisible, container.name]
    );
  };

  console.log(itemsVisible);

  return (
    <Draggable id={container.id} item={container}>
      <Droppable id={container.id} item={container}>
        <div
          onClick={() => handleContainerClick(container)}
          className={`h-16 w-full rounded-lg font-semibold ${fontColor}`}
          style={{ backgroundColor: container.color.hex }}
        >
          {container.name}
        </div>
        <div
          className="flex flex-col pl-2 mt-[-4px] rounded-b-lg"
          style={{ backgroundColor: `${container.color.hex}44` }}
        >
          <Collapse in={openContainers.includes(container.name)}>
            <div className="flex items-center gap-4 font-semibold text-xl px-2 py-3">
              <Tooltip
                delay={200}
                position="top"
                textClasses={
                  container.items?.length ? "!text-black font-medium" : "hidden"
                }
                label={
                  itemsVisible === container.name ? "Hide items" : "Show items"
                }
              >
                <span
                  className={`flex items-center gap-1 cursor-pointer ${
                    container.items?.length ? "" : "opacity-50"
                  }`}
                  onClick={handleItemsClick}
                >
                  <IconChevronDown
                    size={28}
                    data-rotate={itemsVisible?.includes(container.name)}
                    className="transition data-[rotate=true]:rotate-180"
                  />
                  {container.items?.length}
                </span>
              </Tooltip>
              <Tooltip delay={200} position="top" label="Go to container page">
                <Link href={`/containers/${container.id}`}>
                  <IconExternalLink size={28} className="text-black" />
                </Link>
              </Tooltip>
            </div>

            <Collapse in={itemsVisible?.includes(container.name)}>
              <div className="flex flex-col gap-2 my-4">
                {container?.items?.map((item) => (
                  <DraggableItemCard
                    item={item}
                    activeItem={activeItem}
                    key={item.name}
                    bgColor={bgColor}
                    shadow={shadow}
                  />
                ))}
              </div>
            </Collapse>
            <div className="!flex !flex-col !gap-3">
              {container?.containers &&
                sortObjectArray(container.containers).map((childContainer) => (
                  <Container
                    container={childContainer}
                    first={false}
                    key={childContainer.name}
                    activeItem={activeItem}
                    openContainers={openContainers}
                    handleContainerClick={handleContainerClick}
                    bgColor={bgColor}
                  />
                ))}
            </div>
            <Space h={10} />
          </Collapse>
        </div>
      </Droppable>
    </Draggable>
  );
};

export default Container;
