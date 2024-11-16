"use client";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor } from "../lib/helpers";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { cardStyles } from "../lib/styles";

const ContainerCard = ({ container, handleFavoriteClick }) => {
  const { data } = useSWR(`/containers/api/${container.id}/counts`, fetcher);
  return (
    <Card
      classNames={{
        root: "@container hover:brightness-95 active:brightness-90 !p-0 !rounded-md !shadow-md active:!shadow-sm",
      }}
      styles={{
        root: {
          backgroundColor: container?.color?.hex || "#ececec",
          color: getTextColor(container?.color?.hex) || "black",
        },
      }}
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
