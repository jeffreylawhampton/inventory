"use client";
import useSWR from "swr";
import { useState } from "react";
import CountPills from "./CountPills";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { getTextColor, hexToHSL } from "../lib/helpers";
import { IconCircleFilled, IconCircleMinus } from "@tabler/icons-react";
import { fetcher } from "../lib/fetcher";

const ContainerCard = ({
  container,
  handleContainerFavoriteClick,
  showDelete,
  isSelected = true,
  handleSelect,
  activeItem,
  activeContainer,
}) => {
  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex);

  const { data } = useSWR(`/containers/api/${container.id}/counts`, fetcher);

  return (
    <Draggable id={container.id} item={container} activeItem={activeItem}>
      <Droppable id={container.id} item={container}>
        <div
          className={`@container rounded-md shadow-sm active:shadow-none p-3 relative ${
            showDelete && !isSelected ? "opacity-40" : ""
          } ${
            activeContainer && activeContainer != container.id
              ? "opacity-50"
              : "opacity-100"
          }`}
          style={{
            backgroundColor: currentColor,
            color: getTextColor(container?.color?.hex) || "black",
          }}
          onMouseEnter={() => setCurrentColor(hoverColor)}
          onMouseLeave={() => setCurrentColor(container?.color?.hex)}
          onClick={() => handleSelect(container.id)}
          aria-selected={isSelected}
        >
          <div className="flex flex-col justify-between @260px:flex-row items-start @260px:items-center gap-2">
            <div className="flex gap-4 items-center justify-between w-full pl-4">
              <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
                {container?.name}
              </h2>

              {showDelete ? (
                <div className="">
                  {isSelected ? (
                    <IconCircleMinus
                      className="text-white bg-danger rounded-full w-6 h-6"
                      aria-label="Unselected"
                    />
                  ) : (
                    <IconCircleFilled
                      className="text-white opacity-50 w-6 h-6"
                      aria-label="Selected"
                    />
                  )}
                </div>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>
            <CountPills
              containerCount={data?.containers?.length}
              itemCount={data?.items?.length}
              textClasses={"text-xs font-medium"}
              verticalMargin="my-0 !pl-0"
              transparent
              showContainers
              showFavorite
              showItems
              showEmpty={false}
              item={container}
              handleFavoriteClick={handleContainerFavoriteClick}
              showDelete={showDelete}
            />
          </div>
        </div>
      </Droppable>
    </Draggable>
  );
};

export default ContainerCard;
