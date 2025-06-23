"use client";
import Favorite from "./Favorite";
import CategoryPill from "./CategoryPill";
import AddRemoveSelector from "./AddRemoveSelector";
import { v4 } from "uuid";

const AddRemoveCard = ({
  item,
  showFavorite = true,
  handleSelect,
  isSelected,
  isRemove,
}) => {
  return (
    <div
      className={`min-h-[81px] group rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200/80  border-2 border-bluegray-200/80  active:shadow-none active:bg-bluegray-400/80 ${
        isSelected && !isRemove
          ? "border-primary-600"
          : "opacity-50 hover:opacity-75"
      }`}
      onClick={() => handleSelect(item)}
    >
      <div className="py-2 pl-[16px] pr-3">
        <span className="flex gap-2 mb-[1px] justify-between items-center min-h-[28px]">
          <h2 className="flex gap-1.5 text-sm font-semibold leading-tight break-words hyphens-auto text-pretty mb-1">
            {item?.name}{" "}
            {showFavorite ? (
              <Favorite onClick={null} item={item} size={16} showDelete />
            ) : null}
          </h2>

          <AddRemoveSelector isSelected={isSelected} />
        </span>
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
                link={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddRemoveCard;
