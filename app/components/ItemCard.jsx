"use client";
import { Card, HoverCard, Image } from "@mantine/core";
import { v4 } from "uuid";
import CategoryPill from "./CategoryPill";
import { cardStyles } from "../lib/styles";
import { IconMapPin, IconBox } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const ItemCard = ({ item, showLocation = true }) => {
  const router = useRouter();
  return (
    <Card
      component="a"
      href={`/items/${item?.id}`}
      radius={cardStyles.radius}
      classNames={cardStyles.cardClasses}
    >
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
            <h1 className="text-base font-semibold pb-2 leading-tight">
              {item?.name}
            </h1>
            {(showLocation && item?.location?.id) || item?.container?.id ? (
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
                          ? () => router.push(`/locations/${item.location.id}`)
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
            ) : null}
          </span>
          <div className="flex gap-1 flex-wrap mb-5">
            {item?.categories?.map((category) => {
              return <CategoryPill key={v4()} category={category} />;
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
