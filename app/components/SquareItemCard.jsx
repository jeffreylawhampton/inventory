"use client";
import { useContext } from "react";
import { CategoryPill, DeleteSelector, Favorite, LucideIcon } from ".";
import { v4 } from "uuid";
import { DeviceContext } from "../providers";

const SquareItemCard = ({
  item,
  handleFavoriteClick,
  handleClick,
  isSelected,
  hideCategory = -1,
}) => {
  const { showDelete, showRemove } = useContext(DeviceContext);
  return (
    <div
      className={`min-h-[70px] group box-content rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200/80 hover:bg-bluegray-300 border-2 border-bluegray-200/80 hover:border-bluegray-300/90 active:shadow-none active:bg-bluegray-400/80 ${
        showDelete || showRemove
          ? !isSelected
            ? "opacity-50"
            : " !border-danger-500 "
          : ""
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        onClick={() => handleClick(item)}
      />
      <div className="py-2 pl-[16px] pr-3">
        <div className="flex gap-1 mb-1 items-center min-h-[28px] @container">
          <LucideIcon
            fill="transparent"
            stroke="#000"
            size={16}
            iconName={item?.icon}
            type="item"
          />
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] pr-1 ml-1 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {item?.name}
          </h2>
          <Favorite
            onClick={
              showDelete || showRemove ? () => null : handleFavoriteClick
            }
            item={item}
            size={16}
            classes="relative"
          />
        </div>
        <div
          className={`flex gap-1 flex-wrap ${
            item?.categories?.length ? "mb-2" : ""
          }`}
        >
          {item?.categories?.map((category) => {
            return category.id === hideCategory ? null : (
              <CategoryPill
                key={v4()}
                category={category}
                size="xs"
                link={!showDelete && !showRemove}
              />
            );
          })}
        </div>
      </div>
      {showDelete || showRemove ? (
        <div className="absolute top-2 right-2">
          <DeleteSelector isSelectedForDeletion={isSelected} />
        </div>
      ) : null}
    </div>
  );
};

export default SquareItemCard;
