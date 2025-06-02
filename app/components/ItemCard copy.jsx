"use client";
import { useState } from "react";
import { Image } from "@mantine/core";
import Favorite from "./Favorite";
import Link from "next/link";
import DetailsSpoiler from "./DetailsSpoiler";
import DetailsTrigger from "./DetailsTrigger";
import { cardStyles } from "../lib/styles";

const ItemCard = ({
  item,
  showFavorite = true,
  handleFavoriteClick,
  onClick,
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
      className={`rounded-md overflow-hidden relative shadow-sm active:shadow-sm ${bgColor}`}
      onClick={onClick ? onClick : null}
      onMouseEnter={() => setBgColor(cardStyles.hoverBg)}
      onMouseLeave={() => setBgColor(cardStyles.defaultBg)}
    >
      <Link
        prefetch={false}
        href={`/items/${item.id}`}
        className="w-full h-full absolute top-0 left-0"
      />
      <div>
        {item?.images?.length ? (
          <Image
            alt=""
            src={item?.images[0]?.secureUrl}
            className="aspect-3/2 lg:max-h-[200px]"
          />
        ) : null}
      </div>
      <div className="p-5">
        <span className="flex gap-2 mb-2">
          <h1 className="text-lg font-semibold leading-tight break-words hyphens-auto text-pretty">
            {item?.name}
          </h1>{" "}
          {showFavorite ? (
            <Favorite onClick={handleFavoriteClick} item={item} position="" />
          ) : null}
        </span>

        <DetailsSpoiler
          item={item}
          showDetails={isOpen}
          showOuterCategories
          showLocation
          handleEnter={handleEnter}
          handleLeave={handleLeave}
        />

        <DetailsTrigger setShowDetails={setIsOpen} showDetails={isOpen} />
      </div>
    </div>
  );
};

export default ItemCard;
