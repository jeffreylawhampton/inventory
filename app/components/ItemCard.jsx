"use client";
import { useState, useContext } from "react";
import { Image } from "@mantine/core";
import Favorite from "./Favorite";
import Link from "next/link";
import DetailsSpoiler from "./DetailsSpoiler";
import DetailsTrigger from "./DetailsTrigger";
import { FilterContext } from "../items/layout";

const ItemCard = ({ item, showFavorite = true, handleFavoriteClick }) => {
  const { openItems, setOpenItems } = useContext(FilterContext);
  const isOpen = openItems?.includes(item.name);
  const toggleDetails = () => {
    isOpen
      ? setOpenItems(openItems?.filter((i) => i != item.name))
      : setOpenItems([...openItems, item.name]);
  };

  return (
    <div className="rounded-md overflow-hidden relative  bg-bluegray-200">
      <Link
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
        />

        <DetailsTrigger setShowDetails={toggleDetails} showDetails={isOpen} />
      </div>
    </div>
  );
};

export default ItemCard;
