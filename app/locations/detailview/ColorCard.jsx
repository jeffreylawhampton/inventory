"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { getTextColor, hexToHSL } from "../../lib/helpers";
import { LocationContext } from "../layout";
import { CountPills } from "../../components";
import { handleCardFavoriteClick, handleContainerClick } from "../handlers";

import LucideIcon from "@/app/components/LucideIcon";
const ColorCard = ({
  container,
  isSelected = true,
  data: pageData,
  fetchKey,
  isOverlay,
}) => {
  const {
    activeItem,
    openContainers,
    openLocations,
    setOpenContainers,
    setOpenLocations,
    showDelete,
    layoutData,
  } = useContext(LocationContext);

  const router = useRouter();

  const counts = layoutData?.containerCounts?.find(
    (c) => c.id === container.id
  );

  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex);

  return activeItem?.name === container?.name && !isOverlay ? null : (
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative ${
        showDelete && !isSelected ? "opacity-40" : ""
      }`}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(container?.color?.hex)}
      style={{
        backgroundColor: currentColor,
        color: getTextColor(container?.color?.hex) || "black",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        onClick={() =>
          handleContainerClick({
            container,
            openLocations,
            setOpenLocations,
            openContainers,
            setOpenContainers,
            router,
          })
        }
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=container&id=${container.id}`)
            : null
        }
      />
      <div className="flex flex-col justify-between @260px:flex-row items-stretch @260px:items-center gap-2 flex-wrap">
        <div className="flex items-center w-full">
          <LucideIcon
            fill={container?.color?.hex}
            stroke={getTextColor(container?.color?.hex)}
            size={16}
            iconName={container?.icon}
            type="container"
          />
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] ml-2 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {container?.name}
          </h2>
        </div>
        <CountPills
          containerCount={counts?.containerCount}
          itemCount={counts?.itemCount}
          textClasses={"text-xs font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={true}
          showFavorite
          showItems
          showEmpty={false}
          item={container}
          handleFavoriteClick={() =>
            handleCardFavoriteClick({
              item: container,
              type: "container",
              key: fetchKey,
              data: pageData,
            })
          }
          showDelete={showDelete}
        />
      </div>
    </div>
  );
};

export default ColorCard;
