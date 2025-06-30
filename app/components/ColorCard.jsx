"use client";
import { useState } from "react";
import Link from "next/link";
import { getTextColor, hexToHSL } from "../lib/helpers";
import CountPills from "./CountPills";
import DeleteSelector from "./DeleteSelector";
import ThumbnailIcon from "./ThumbnailIcon";

const ColorCard = ({
  item,
  isSelected,
  showDelete,
  type,
  handleFavoriteClick,
  handleSelect,
}) => {
  const [currentColor, setCurrentColor] = useState(
    item?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(item?.color?.hex);
  return (
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative flex gap-3 ${
        showDelete && !isSelected ? "opacity-40" : ""
      }`}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(item?.color?.hex)}
      onClick={showDelete ? () => handleSelect(item.id) : null}
      aria-selected={isSelected}
      style={{
        backgroundColor: currentColor,
        border: `3px solid ${
          isSelected && showDelete
            ? "var(--mantine-color-danger-4)"
            : currentColor
        }`,
        color: getTextColor(item?.color?.hex) || "black",
      }}
    >
      {showDelete ? null : (
        <Link
          prefetch={false}
          href={`/${type === "category" ? "categories" : "containers"}/${
            item.id
          }`}
          className="w-full h-full absolute top-0 left-0"
        />
      )}

      <div className="flex justify-start items-center w-1/4 p-2 min-w-[40px]">
        <ThumbnailIcon
          stroke={getTextColor(item?.color?.hex)}
          fill="transparent"
          iconName={item?.icon}
          type={type}
          containerWidth={"w-full"}
        />
      </div>
      <div className="w-full flex flex-col gap-2 @260px:flex-row items-stretch @260px:items-center flex-wrap">
        <div className="flex items-center w-full ml-1">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] ml-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {item?.name}
          </h2>
        </div>
        <CountPills
          containerCount={item?.containerCount}
          itemCount={
            type === "container" ? item?.itemCount : item?._count?.items
          }
          textClasses={"text-xs font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={type === "container"}
          showFavorite
          showItems
          showEmpty={false}
          item={item}
          handleFavoriteClick={handleFavoriteClick}
          showDelete={showDelete}
        />
      </div>
      {showDelete ? (
        <div className="absolute top-2 right-2">
          <DeleteSelector isSelectedForDeletion={isSelected} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorCard;
