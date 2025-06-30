"use client";
import Link from "next/link";
import { BreadcrumbTrail } from ".";
import CategoryPill from "./CategoryPill";
import DeleteSelector from "./DeleteSelector";
import Favorite from "./Favorite";
import LucideIcon from "./LucideIcon";
import { v4 } from "uuid";

const SquareItemCard = ({
  item,
  handleFavoriteClick,
  onClick,
  handleSelect,
  isSelected,
  showDelete,
}) => {
  return (
    <div
      className={`min-h-[81px] group box-content rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200/80 hover:bg-bluegray-300 border-2 border-bluegray-200/80 hover:border-bluegray-300/90 active:shadow-none active:bg-bluegray-400/80 ${
        showDelete ? (!isSelected ? "opacity-50" : " !border-danger-500 ") : ""
      }`}
      onClick={
        showDelete ? () => handleSelect(item.id) : onClick ? onClick : null
      }
    >
      {showDelete ? null : (
        <Link
          prefetch={false}
          href={`/items/${item.id}`}
          className="w-full h-full absolute top-0 left-0"
        />
      )}
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
            onClick={showDelete ? () => null : handleFavoriteClick}
            item={item}
            size={16}
          />
        </div>
        <div
          className={`flex gap-1 flex-wrap ${
            item?.categories?.length ? "mb-2" : ""
          }`}
        >
          {item?.categories?.map((category) => {
            return (
              <CategoryPill
                key={v4()}
                category={category}
                size="xs"
                link={!showDelete}
              />
            );
          })}
        </div>
        <BreadcrumbTrail data={{ ...item, type: "item" }} />
      </div>
      {showDelete ? (
        <div className="absolute top-2 right-2">
          <DeleteSelector isSelectedForDeletion={isSelected} />
        </div>
      ) : null}
    </div>
  );
};

export default SquareItemCard;
