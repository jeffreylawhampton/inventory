"use client";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import { cardStyles } from "../lib/styles";
import {
  IconMapPin,
  IconBox,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { checkLuminance } from "../lib/helpers";
import ColoredFavorite from "./ColoredFavorite";

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
      radius="md"
      classNames={{ root: "@container hover:brightness-90" }}
      styles={{
        root: {
          backgroundColor: container?.color?.hex || "#ececec",
          color: checkLuminance(container?.color?.hex) || "black",
        },
      }}
    >
      <Link
        href={`/containers/${container.id}`}
        className="w-full h-full absolute top-0 left-0"
      />

      <div className="py-2 pl-2 flex flex-col @sm:flex-row gap-0 w-full justify-between h-full">
        <div className="flex gap-1 mb-2">
          <h1 className="text-lg font-semibold pb-2 leading-tight">
            {container?.name}
          </h1>

          <ColoredFavorite item={container} onClick={handleFavoriteClick} />
        </div>

        <CountPills
          containerCount={childCount}
          itemCount={itemCount}
          textClasses={"text-sm font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers
          showItems
          showEmpty={false}
        />
      </div>
    </Card>
  );
};

export default ContainerCard;
