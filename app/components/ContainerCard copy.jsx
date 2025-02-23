"use client";
import { useState } from "react";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor, hexToHSL } from "../lib/helpers";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { cardStyles } from "../lib/styles";

const ContainerCard = ({ container, handleFavoriteClick }) => {
  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex, 8);
  const activeColor = hexToHSL(container?.color?.hex, 12);
  const { data } = useSWR(`/containers/api/${container.id}/counts`, fetcher);
  return (
    <Card
      classNames={{
        root: "@container !p-0 !rounded-md !shadow-md active:!shadow-sm",
      }}
      styles={{
        root: {
          backgroundColor: currentColor,
          color: getTextColor(container?.color?.hex) || "black",
        },
      }}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(container.color?.hex)}
      onMouseDown={() => setCurrentColor(activeColor)}
    >
      <Link
        href={`/containers/${container.id}`}
        className="w-full h-full absolute top-0 left-0"
      />

      <div className="flex flex-col @xs:flex-row gap-x-0 gap-y-2.5 w-full @xs:justify-between @xs:items-center h-full p-5 @xs:p-4">
        <h1 className={cardStyles.headingClasses}>{container?.name}</h1>

        <CountPills
          containerCount={data?.containers?.length}
          itemCount={data?.items?.length}
          textClasses={"text-sm font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={true}
          showFavorite
          showItems
          showEmpty={false}
          item={container}
          handleFavoriteClick={handleFavoriteClick}
        />
      </div>
    </Card>
  );
};

export default ContainerCard;
