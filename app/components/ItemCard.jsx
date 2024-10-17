"use client";
import { useState } from "react";
import { Button, Card, Collapse, Image, Pill, Spoiler } from "@mantine/core";
import { v4 } from "uuid";
import CategoryPill from "./CategoryPill";
import { cardStyles } from "../lib/styles";
import { IconMapPin, IconBox, IconChevronRight } from "@tabler/icons-react";
import Favorite from "./Favorite";
import Link from "next/link";
import IconPill from "./IconPill";

const ItemCard = ({
  item,
  showLocation = true,
  showFavorite = true,
  handleFavoriteClick,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const labelClass = `transition ${
    showDetails ? "rotate-[-90deg]" : "rotate-90"
  }`;
  const spoilerLabel = (
    <div className="flex gap-1 font-medium text-sm">
      <span>Details</span>
      <span className={labelClass}>
        <IconChevronRight strokeWidth={2} size={16} />
      </span>
    </div>
  );
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

        {item?.categories?.length ? (
          <div className="flex gap-1 flex-wrap">
            {item?.categories?.map((category) => {
              return <CategoryPill key={v4()} category={category} size="xs" />;
            })}
          </div>
        ) : null}

        <Spoiler
          maxHeight={0}
          expanded={showDetails}
          onExpandedChange={setShowDetails}
          showLabel={spoilerLabel}
          hideLabel={spoilerLabel}
          classNames={{ root: "mt-3" }}
        >
          {item?.description ||
          item?.location?.name ||
          item?.container?.name ||
          item?.purchasedAt ||
          item?.serialNumber ||
          item?.quantity ||
          item?.value ? (
            <div className={cardStyles.detailClasses}>
              <div className="flex flex-wrap gap-x-[2px] gap-y-[5px] items-center text-sm font-medium">
                {item?.location?.name ? (
                  <IconPill
                    icon={<IconMapPin size={16} />}
                    href={`/locations/${item?.location?.id}`}
                    name={item?.location?.name}
                    size="xs"
                  />
                ) : null}

                {item?.location?.name && item?.container?.name ? (
                  <IconChevronRight size={16} />
                ) : null}
                {item?.container?.name ? (
                  <IconPill
                    icon={<IconBox size={16} />}
                    href={`/containers/${item?.container?.id}`}
                    name={item?.container?.name}
                    size="xs"
                  />
                ) : null}
              </div>
              {item?.description ? (
                <p className="flex gap-2">
                  <label>Description:</label>

                  {item?.description}
                </p>
              ) : null}

              {item?.purchasedAt ? (
                <p className="flex gap-2">
                  <label>Purchased at:</label>

                  {item?.purchasedAt}
                </p>
              ) : null}

              {item?.serialNumber ? (
                <p className="flex gap-2">
                  <label>Serial number:</label>

                  {item?.serialNumber}
                </p>
              ) : null}

              {item?.quantity ? (
                <p className="flex gap-2">
                  <label>Quantity:</label>

                  {item?.quantity}
                </p>
              ) : null}

              {item?.value ? (
                <p className="flex gap-2">
                  <label>Value:</label>

                  {item?.value}
                </p>
              ) : null}
            </div>
          ) : null}
        </Spoiler>
      </div>
    </Card>
  );
};

export default ItemCard;

{
  /* <Pill
size="sm"
component="a"
href={`/containers/${item?.container?.id}`}
classNames={{
  label: "font-semibold lg:p-1 flex gap-[2px] items-center",
  root: "relative !bg-bluegray-500 !bg-opacity-25 hover:!bg-opacity-35 active:!bg-opacity-45",
}}
styles={{
  root: {
    height: "fit-content",
  },
}}
>
<IconBox aria-label="Container" size={16} />
{item?.container?.name}
</Pill> */
}

{
  /* <Pill
size="sm"
component="a"
href={`/locations/${item?.location?.id}`}
classNames={{
  label: "font-semibold lg:p-1 flex gap-[2px] items-center",
  root: "relative !bg-bluegray-500 !bg-opacity-25 hover:!bg-opacity-35 active:!bg-opacity-45",
}}
styles={{
  root: {
    height: "fit-content",
  },
}}
>
<IconMapPin aria-label="Location" size={16} />
{item?.location?.name}
</Pill> */
}
