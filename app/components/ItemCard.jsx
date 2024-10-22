"use client";
import { useState } from "react";
import { Card, Image } from "@mantine/core";
import Favorite from "./Favorite";
import Link from "next/link";
import DetailsSpoiler from "./DetailsSpoiler";
import DetailsTrigger from "./DetailsTrigger";

const ItemCard = ({
  item,
  showLocation = true,
  showFavorite = true,
  handleFavoriteClick,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card
      padding="lg"
      radius="md"
      classNames={{
        root: "relative !py-0 !bg-bluegray-200 drop-shadow-md active:drop-shadow-none hover:!bg-bluegray-300 active:!bg-bluegray-400",
      }}
    >
      <Link
        href={`/items/${item.id}`}
        className="w-full h-full absolute top-0 left-0"
      />
      <Card.Section>
        {item?.images?.length ? (
          <Image
            alt=""
            src={item?.images[0]?.secureUrl}
            className={`aspect-3/2 lg:max-h-[200px]`}
          />
        ) : null}
      </Card.Section>
      <div className="py-5">
        <span className={`flex gap-2 mb-2`}>
          <h1 className="text-lg font-semibold leading-tight">{item?.name}</h1>{" "}
          {showFavorite ? (
            <Favorite
              onClick={() => handleFavoriteClick(item)}
              isFavorite={item.favorite}
              position=""
            />
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
    </Card>
  );
};

export default ItemCard;
