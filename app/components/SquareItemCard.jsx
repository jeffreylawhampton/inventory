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
  const [bgColor, setBgColor] = useState(cardStyles.defaultBg);

  const handleEnter = () => {
    setBgColor(cardStyles.defaultBg);
  };

  const handleLeave = () => {
    setBgColor(cardStyles.hoverBg);
  };

  return (
    <div
      style={{ borderColor: bgColor }}
      className={`border-2 rounded-md overflow-hidden relative shadow-md active:shadow-sm ${bgColor} ${
        showDelete
          ? !isSelected
            ? "opacity-50"
            : "border-danger-500 box-content"
          : ""
      }`}
      onClick={
        showDelete ? () => handleSelect(item.id) : onClick ? onClick : null
      }
      onMouseEnter={() => setBgColor(cardStyles.hoverBg)}
      onMouseLeave={() => setBgColor(cardStyles.defaultBg)}
    >
      {showDelete ? null : (
        <Link
          href={`/items/${item.id}`}
          className="w-full h-full absolute top-0 left-0"
        />
      )}
      <div>
        {item?.images?.length ? (
          <Image
            alt=""
            src={item?.images[0]?.secureUrl}
            className="aspect-3/2 lg:max-h-[200px]"
          />
        ) : null}
      </div>
      <div className="py-2 pl-[16px] pr-3">
        <span className="flex gap-2 mb-[1px] justify-between items-center">
          <h2 className="flex gap-1.5 text-sm font-semibold leading-tight break-words hyphens-auto text-pretty">
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

          <DetailsTrigger
            setShowDetails={setIsOpen}
            showDetails={isOpen}
            label=""
          />
        </span>
        <div
          className={`flex gap-1 flex-wrap ${
            item?.categories?.length ? "mb-2" : ""
          }`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
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
          handleEnter={handleEnter}
          handleLeave={handleLeave}
          showDelete={showDelete}
        />
      </div>
    </div>
  );
};

export default SquareItemCard;
