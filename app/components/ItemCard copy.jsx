"use client";
import { Card, HoverCard, Image } from "@mantine/core";
import { v4 } from "uuid";
import CategoryPill from "./CategoryPill";
import { cardStyles } from "../lib/styles";
import {
  IconMapPin,
  IconBox,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Favorite from "./Favorite";
import Link from "next/link";

const ItemCard = ({
  item,
  showLocation = true,
  showFavorite = true,
  handleFavoriteClick,
}) => {
  return (
    <Card radius={cardStyles.radius} classNames={cardStyles.cardClasses}>
      <Link
        href={`/items/${item.id}`}
        className="w-full h-full absolute top-0 left-0"
      />
      <div className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
        {item?.images?.length ? (
          <Image
            alt=""
            className={cardStyles.imageClasses}
            src={item?.images[0]?.secureUrl}
            radius={cardStyles.radius}
            width="36%"
            height="100%"
          />
        ) : null}
        <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start h-full">
          <span className="flex gap-2">
            <h1 className="text-lg font-semibold pb-2 leading-tight">
              {item?.name}
            </h1>{" "}
            {showFavorite ? (
              <div
                className="relative top-[-3px] left-[-3px] p-[3px]"
                onClick={() => handleFavoriteClick({ item })}
              >
                {item?.favorite ? (
                  <IconHeartFilled
                    size={22}
                    className=" text-danger-400 z-[80]"
                  />
                ) : (
                  <IconHeart
                    size={22}
                    className=" text-bluegray-600 hover:text-danger-400 z-[80]"
                  />
                )}
              </div>
            ) : null}
            {/* {(showLocation && item?.location?.id) || item?.container?.id ? (
                <HoverCard
                  position="top"
                  radius="md"
                  classNames={{
                    dropdown: `text-sm font-medium flex flex-col gap-1`,
                  }}
                >
                  <HoverCard.Target>
                    <IconMapPin size={18} />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    {item?.location?.id ? (
                      <div
                        className={`flex gap-1 justify-start ${
                          item?.location?.id && "cursor-pointer"
                        }`}
                        onClick={
                          item?.location?.id
                            ? () =>
                                router.push(`/locations/${item.location.id}`)
                            : null
                        }
                      >
                        <IconMapPin size={16} /> {item?.location?.name}
                      </div>
                    ) : null}
                    {item?.container?.id ? (
                      <div
                        className={`flex gap-1 justify-start ${
                          item?.container?.id && "cursor-pointer"
                        }`}
                        onClick={
                          item?.container?.id
                            ? () =>
                                router.push(`/containers/${item.container.id}`)
                            : null
                        }
                      >
                        <IconBox size={16} /> {item?.container?.name}
                      </div>
                    ) : null}
                  </HoverCard.Dropdown>
                </HoverCard>
              ) : null} */}
          </span>
          <div className="flex gap-1 flex-wrap mb-5">
            {item?.categories?.map((category) => {
              return <CategoryPill key={v4()} category={category} size="xs" />;
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
