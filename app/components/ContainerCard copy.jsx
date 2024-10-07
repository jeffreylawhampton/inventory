"use client";
import { Card } from "@mantine/core";
import { IconMapPin, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { checkLuminance } from "../lib/helpers";
import CountPills from "./CountPills";
import { Link } from "react-scroll";

const ContainerCard = ({ container, handleFavoriteClick }) => {
  let childCount = 0;
  let itemCount = 0;

  const getCounts = (container) => {
    itemCount += container.items?.length;
    if (container?.containers?.length) {
      childCount += container.containers?.length;
      for (const childContainer of container.containers) {
        getCounts(childContainer);
      }
    }
  };

  getCounts(container);

  return (
    <Card
      radius="lg"
      className="border-none"
      shadow="sm"
      classNames={{
        root: "cursor-pointer hover:brightness-90 !p-0 @container",
      }}
      styles={{
        root: {
          backgroundColor: container?.color?.hex || "#ececec",
          color: checkLuminance(container?.color?.hex) || "black",
        },
      }}
    >
      <Link
        href={`/containers/${container.id}`}
        className="w-full h-full absolute"
      />
      <div className="flex flex-col gap-2 w-full items-start h-full @container !p-5 @md:!p-6">
        <h1 className="@4xs:text-sm @2xs:text-base @sm:text-xl font-semibold pb-4 flex !flex-col gap-3 @xs:!flex-row  w-full justify-between items-start leading-tight">
          {container?.name}
          <div
            className="relative  left-[-3px] p-[3px]"
            onClick={() => handleFavoriteClick({ container })}
          >
            {container?.favorite ? (
              <IconHeartFilled size={20} strokeWidth={2} />
            ) : (
              <IconHeart size={20} strokeWidth={2} />
            )}
          </div>
          <CountPills
            containerCount={childCount}
            itemCount={itemCount}
            textClasses={"text-sm font-medium"}
            verticalMargin="my-0 !pl-0"
            transparent
          />
        </h1>
        {container?.location?.name ? (
          <span className="flex gap-1">
            <IconMapPin /> {container.location.name}
          </span>
        ) : null}
      </div>
    </Card>
  );
};

export default ContainerCard;
