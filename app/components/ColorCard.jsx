"use client";
import { useState } from "react";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor, hexToHSL } from "../lib/helpers";
import LucideIcon from "./LucideIcon";
import DeleteSelector from "./DeleteSelector";

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
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative ${
        showDelete && !isSelected ? "opacity-40" : ""
      }`}
      style={{
        backgroundColor: currentColor,
        border: `3px solid ${
          isSelected && showDelete
            ? "var(--mantine-color-danger-4)"
            : currentColor
        }`,
        color: getTextColor(item?.color?.hex) || "black",
      }}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(item?.color?.hex)}
      onClick={showDelete ? () => handleSelect(item.id) : null}
      aria-selected={isSelected}
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
      <div className="flex flex-col justify-between @260px:flex-row items-start @260px:items-center gap-2">
        <div className="flex gap-4 items-center justify-between w-full">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] flex pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words items-center">
            <LucideIcon
              iconName={item?.icon}
              type={type}
              size={16}
              color={"#fff"}
              stroke={getTextColor(item?.color?.hex)}
              fill={getTextColor(item?.color?.hex) + "44"}
            />
            <span className="pl-1">{item?.name}</span>
          </h2>

          {showDelete ? (
            <div className="absolute top-2 right-2">
              <DeleteSelector isSelectedForDeletion={isSelected} />
            </div>
          ) : null}
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
    </div>
  );
};

export default ColorCard;
