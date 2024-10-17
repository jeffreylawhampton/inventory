import { useContext } from "react";
import { Collapse, Space } from "@mantine/core";
import { getFontColor, sortObjectArray } from "../lib/helpers";
import Droppable from "./Droppable";
import Tooltip from "./Tooltip";
import Draggable from "./Draggable";
import DraggableItemCard from "./DraggableItemCard";
import { AccordionContext } from "../layout";
import {
  IconExternalLink,
  IconChevronDown,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import CountPills from "./CountPills";
import ItemCountPill from "./ItemCountPill";
import { useSessionStorage } from "@mantine/hooks";
import ColoredFavorite from "./ColoredFavorite";

const ContainerAccordion = ({
  container,
  activeItem,
  first = true,
  bgColor,
  shadow,
  handleFavoriteClick,
}) => {
  const { openContainers, setOpenContainers } = useContext(AccordionContext);
  const isOpen = openContainers?.includes(container?.name);

  const [itemsVisible, setItemsVisible] = useSessionStorage({
    key: container.name,
    defaultValue: false,
  });

  const handleContainerClick = () => {
    setOpenContainers(
      openContainers?.includes(container.name)
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  // const handleItemsClick = () => {
  //   setItemsVisible(
  //     itemsVisible?.includes(container.name)
  //       ? itemsVisible.filter((name) => name != container.name)
  //       : [...itemsVisible, container.name]
  //   );
  // };

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

  // const handleFavoriteClick = async ({ container }) => {
  //   console.log(container);
  //   const add = !container.favorite;
  //   const locations = [...data];
  //   const location = locations.find((loc) => loc.id === container.locationId);

  //   const containerArray = [...location.containers];
  //   if (!container.parentContainerId) {
  //     const containerToUpdate = containerArray.find(
  //       (i) => i.name === container.name
  //     );
  //     containerToUpdate.favorite = !container.favorite;
  //   }

  //   try {
  //     await mutate(
  //       "locations",
  //       toggleFavorite({ type: "container", id: container.id, add }),
  //       {
  //         optimisticData: locations,
  //         rollbackOnError: true,
  //         populateCache: false,
  //         revalidate: true,
  //       }
  //     );
  //     toast.success(
  //       add
  //         ? `Added ${container.name} to favorites`
  //         : `Removed ${container.name} from favorites`
  //     );
  //   } catch (e) {
  //     toast.error("Something went wrong");
  //     throw new Error(e);
  //   }
  // };

  return (
    <Draggable id={container.id} item={container}>
      <Droppable id={container.id} item={container}>
        <div
          className={` bg-gray-200 rounded-lg drop-shadow-md ${
            activeItem?.name === container.name ? "hidden" : ""
          } relative `}
        >
          <div
            className={`${getFontColor(
              container?.color?.hex
            )} @container transition-all flex w-full justify-between items-center pr-3 py-3 pl-10 rounded-t-lg ${
              isOpen ? "rounded-b-sm" : "rounded-b-lg"
            }`}
            style={{ backgroundColor: container?.color?.hex || "#ececec" }}
          >
            <div className="flex gap-1 items-center max-w-[58%]">
              <Link
                className={`${getFontColor(
                  container?.color?.hex
                )} !leading-tight font-semibold hover:text-opacity-90 text-sm @xs:text-base @3xl:text-md max-w-[85%] overflow-hidden`}
                href={`/containers/${container.id}`}
              >
                {container.name}{" "}
              </Link>

              <ColoredFavorite onClick={handleFavoriteClick} item={container} />
            </div>

            <div
              className={`flex gap-1 pl-2 py-2 items-center ${getFontColor(
                container?.color?.hex
              )}`}
              onClick={handleContainerClick}
            >
              <CountPills
                onClick={handleContainerClick}
                containerCount={containerCount}
                itemCount={itemCount}
                textClasses="text-sm"
                transparent
                showContainers
                showItems
              />

              <IconChevronDown
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          <Collapse in={openContainers?.includes(container.name)}>
            <div
              className="w-full mt-[-4px] rounded-b-lg py-3 px-2"
              style={{ backgroundColor: `${container?.color?.hex}44` }}
            >
              <div className="flex items-center justify-between p-2 w-fit mb-2 gap-1">
                <div
                  onClick={
                    container.items?.length
                      ? () => setItemsVisible(!itemsVisible)
                      : null
                  }
                >
                  <ItemCountPill
                    isOpen={itemsVisible}
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
              <Collapse in={itemsVisible}>
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
                  <Space h={2} />
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
