"use client";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor } from "../lib/helpers";

const CategoryCard = ({ category, handleFavoriteClick }) => {
  return (
    <Card
      classNames={{
        root: "@container hover:brightness-90 !p-0 !rounded-md !shadow-md",
      }}
      styles={{
        root: {
          backgroundColor: category?.color?.hex || "#ececec",
          color: getTextColor(category?.color?.hex) || "black",
        },
      }}
    >
      <Link
        href={`/categories/${category.id}`}
        className="w-full h-full absolute top-0 left-0"
      />

      <div className="flex flex-col @2xs:flex-row gap-x-0 gap-y-3 w-full @xs:justify-between @2xs:items-center h-full p-4">
        <h1 className="!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words w-full @xs:w-1/2">
          {category?.name}
        </h1>

        <CountPills
          itemCount={category?._count?.items}
          textClasses="text-sm font-medium"
          verticalMargin="my-0 !pl-0"
          transparent
          showFavorite
          showItems
          showEmpty={false}
          item={category}
          handleFavoriteClick={handleFavoriteClick}
        />
      </div>
    </Card>
  );
};

export default CategoryCard;
