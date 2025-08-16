"use client";
import { useState } from "react";
import Link from "next/link";
import { getTextColor, hexToHSL } from "../lib/helpers";
import { CountPills, DeleteSelector, LucideIcon } from ".";

const ColorCard = ({
  item,
  isSelected,
  showDelete,
  type,
  handleFavoriteClick,
  handleClick,
}) => {
  const [currentColor, setCurrentColor] = useState(
    item?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(item?.color?.hex);
  return (
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative flex gap-2 ${
        showDelete
          ? isSelected
            ? "!bg-danger-500 !text-white"
            : "opacity-30"
          : ""
      }`}
      onClick={showDelete ? () => handleClick(item) : null}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(item?.color?.hex)}
      aria-selected={isSelected}
      style={{
        backgroundColor: currentColor,
        color:
          showDelete && isSelected
            ? "white"
            : getTextColor(item?.color?.hex) || "black",
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
      <div className="w-full flex flex-col gap-2 @260px:flex-row items-stretch @260px:items-center flex-wrap">
        <div className="flex items-center w-full ml-1">
          <LucideIcon
            iconName={item.icon}
            type={type}
            fill="transparent"
            stroke={
              showDelete && isSelected
                ? "white"
                : getTextColor(item?.color?.hex)
            }
            size={18}
          />
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] ml-1.5 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
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
