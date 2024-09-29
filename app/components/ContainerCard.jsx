"use client";
import { Card } from "@mantine/core";
import { IconBox, IconMapPin } from "@tabler/icons-react";
import { checkLuminance } from "../lib/helpers";

const ContainerCard = ({ container }) => {
  return (
    <Card
      component="a"
      href={`/containers/${container.id}`}
      radius="lg"
      className="border-none"
      shadow="sm"
      classNames={{
        root: "cursor-pointer hover:brightness-90 aspect-[3/1] !p-4",
      }}
      styles={{
        root: {
          backgroundColor: container?.color?.hex || "#ececec",
          color: checkLuminance(container?.color?.hex) || "black",
        },
      }}
    >
      <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start h-full">
        <h1 className="text-xl font-semibold pb-1 flex gap-2">
          {container?.name}
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
