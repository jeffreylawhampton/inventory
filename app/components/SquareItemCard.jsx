"use client";
import { useState } from "react";
import { Image } from "@mantine/core";
import Favorite from "./Favorite";
import Link from "next/link";
import CategoryPill from "./CategoryPill";
import DetailsSpoiler from "./DetailsSpoiler";
import DetailsTrigger from "./DetailsTrigger";
import { cardStyles } from "../lib/styles";
import { v4 } from "uuid";
import { IconCircleMinus, IconCircle } from "@tabler/icons-react";

const SquareItemCard = ({
  item,
  showFavorite = true,
  handleFavoriteClick,
  onClick,
  handleSelect,
  isSelected,
  showDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`min-h-[81px] group rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200/80 hover:bg-bluegray-300 border border-bluegray-200/80 hover:border-bluegray-300/90 active:shadow-none active:bg-bluegray-400/80 ${
        showDelete
          ? !isSelected
            ? "opacity-50"
            : " !border-danger-500 box-content"
          : ""
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
      {/* <div>
        {item?.images?.length ? (
          <Image
            alt=""
            src={item?.images[0]?.secureUrl}
            className="aspect-3/2 lg:max-h-[200px] group-hover:brightness-90"
          />
        ) : null}
      </div> */}
      <div className="py-2 pl-[16px] pr-3">
        <span className="flex gap-2 mb-[1px] justify-between items-center min-h-[28px]">
          <h2 className="flex gap-1.5 text-sm font-semibold leading-tight break-words hyphens-auto text-pretty mb-1">
            {item?.name}{" "}
            {showFavorite ? (
              <Favorite
                onClick={handleFavoriteClick}
                item={item}
                position=""
                size={16}
                classes=""
                showDelete={showDelete}
              />
            ) : null}
          </h2>

          {showDelete ? (
            <>
              {isSelected ? (
                <IconCircleMinus
                  className="text-white bg-danger rounded-full w-6 h-6"
                  aria-label="Unselected"
                />
              ) : (
                <IconCircle
                  className="text-bluegray-500 opacity-50 w-6 h-6"
                  aria-label="Selected"
                />
              )}
            </>
          ) : (
            <DetailsTrigger
              setShowDetails={setIsOpen}
              showDetails={isOpen}
              label=""
            />
          )}
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
                link={!showDelete}
              />
            );
          })}
        </div>
        <DetailsSpoiler
          item={item}
          showDetails={isOpen}
          showOuterCategories
          showLocation
          showDelete={showDelete}
        />
      </div>
    </div>
  );
};

export default SquareItemCard;
