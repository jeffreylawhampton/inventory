import { useContext, useState } from "react";
import { Collapse, Space } from "@mantine/core";
import { getFontColor, sortObjectArray } from "../lib/helpers";
import Droppable from "./Droppable";
import Tooltip from "./Tooltip";
import Draggable from "./Draggable";
import DraggableItemCard from "./DraggableItemCard";
import { AccordionContext } from "../layout";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import ItemCountPill from "./ItemCountPill";

const ContainerAccordion = ({
  container,
  activeItem,
  bgColor,
  shadow,
  handleFavoriteClick,
}) => {
  const { openContainers, setOpenContainers } = useContext(AccordionContext);
  const isOpen = openContainers?.includes(container?.name);
  const [showItems, setShowItems] = useState(false);

  const handleContainerClick = () => {
    setOpenContainers(
      openContainers?.includes(container.name)
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  let containerCount = 0;
  let itemCount = 0;

  const getCounts = (container) => {
    itemCount += container.items?.length;
    if (container?.containers?.length) {
      containerCount += container.containers?.length;
      for (const childContainer of container.containers) {
        getCounts(childContainer);
      }
    }
  };

  getCounts(container);

  return (
    <Draggable id={container.id} item={container}>
      <Droppable id={container.id} item={container}>
        <div
          className={` bg-gray-200 rounded-lg drop-shadow-lg ${
            activeItem?.name === container.name ? "hidden" : ""
          } relative @container`}
        >
          <div
            className={`${getFontColor(
              container?.color?.hex
            )}  @container transition-all flex flex-col @sm:flex-row gap-x-2 items-start @sm:items-center w-full justify-between pr-3 py-3 pl-10 rounded-t-lg ${
              isOpen ? "rounded-b-sm" : "rounded-b-lg"
            }`}
            style={{ backgroundColor: container?.color?.hex || "#ececec" }}
          >
            <Link
              className={`${getFontColor(
                container?.color?.hex
              )} @sm:w-2/5 !break-all text-pretty hyphens-auto !leading-tight font-semibold hover:text-opacity-90 text-sm @xs:text-base @3xl:text-md`}
              href={`/containers/${container.id}`}
            >
              {container.name}{" "}
            </Link>

            <div
              className={`min-w-1/2 gap-1 flex pl-0 @sm:pl-2 py-2 items-center ${getFontColor(
                container?.color?.hex
              )}`}
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
                handleFavoriteClick={handleFavoriteClick}
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

          <Collapse in={openContainers?.includes(container.name)}>
            <div
              className="w-full rounded-b-lg p-3 bg-bluegray-300"
              style={{ backgroundColor: `${container?.color?.hex}33` }}
            >
              <div className="flex items-center justify-between p-2 w-fit mb-2 gap-1">
                <div
                  onClick={
                    container.items?.length
                      ? () => setShowItems(!showItems)
                      : null
                  }
                >
                  <ItemCountPill
                    isOpen={showItems}
                    itemCount={container.items?.length}
                    transparent
                  />
                </div>
                <Tooltip label="Go to container page" position="top">
                  <Link
                    className="bg-white bg-opacity-20 px-4 py-1 h-[27px] rounded-full"
                    href={`/containers/${container.id}`}
                  >
                    <IconExternalLink
                      size={18}
                      aria-label="Go to container page"
                    />
                  </Link>
                </Tooltip>
              </div>
              <Collapse in={showItems}>
                <div className="flex flex-col gap-2">
                  {container?.items?.map((item) => (
                    <DraggableItemCard
                      item={item}
                      activeItem={activeItem}
                      key={item.name}
                      bgColor={bgColor}
                      shadow={shadow}
                    />
                  ))}
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
                        handleContainerClick={handleContainerClick}
                        handleFavoriteClick={handleFavoriteClick}
                        bgColor={bgColor}
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
