"use client";
import { useState } from "react";
import { Image } from "@mantine/core";
import Favorite from "./Favorite";
import Link from "next/link";
import DetailsSpoiler from "./DetailsSpoiler";
import DetailsTrigger from "./DetailsTrigger";

const ItemCard = ({ item, showFavorite = true, handleFavoriteClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-md overflow-hidden relative drop-shadow-md bg-bluegray-200 hover:bg-bluegray-300 active:bg-bluegray-300 active:drop-shadow-sm">
      <Link
        href={`/items/${item.id}`}
        className="w-full h-full absolute top-0 left-0"
      />
      {/* <div>
        {item?.images?.length ? (
          <Image
            alt=""
            src={item?.images[0]?.secureUrl}
            className="aspect-3/2 lg:max-h-[200px]"
          />
        ) : null}
      </div> */}
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
          showDetails={showDetails}
          showOuterCategories
          showLocation
        />

        <DetailsTrigger
          setShowDetails={setShowDetails}
          showDetails={showDetails}
        />
      </div>
    </div>
  );
};

export default ItemCard;
