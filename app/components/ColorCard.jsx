"use client";
import useSWR from "swr";
import { useState } from "react";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor, hexToHSL } from "../lib/helpers";
import {
  IconCircleFilled,
  IconCircleMinus,
  IconBox,
  IconTag,
} from "@tabler/icons-react";
import { fetcher } from "../lib/fetcher";

const ColorCard = ({
  item,
  handleFavoriteClick,
  showDelete,
  isSelected = true,
  handleSelect,
  isContainer = false,
}) => {
  const [currentColor, setCurrentColor] = useState(
    item?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(item?.color?.hex);

  const { data } = useSWR(
    `/containers/api/${item.id}/counts`,
    isContainer ? fetcher : null
  );

  return (
    <Card
      classNames={{
        root: `@container !p-0 !rounded-md !shadow-md active:!shadow-sm  ${
          showDelete && !isSelected ? "!opacity-40" : ""
        }`,
      }}
      styles={{
        root: {
          backgroundColor: currentColor,
          color: getTextColor(item?.color?.hex) || "black",
        },
      }}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(item?.color?.hex)}
      onClick={showDelete ? () => handleSelect(item.id) : null}
      aria-selected={isSelected}
    >
      {showDelete ? null : (
        <Link
          href={
            isContainer ? `/containers/${item.id}` : `/categories/${item.id}`
          }
          className="w-full h-full absolute top-0 left-0"
        />
      )}

      <div
        className={`flex flex-col justify-between gap-x-0 gap-y-3 w-full h-full px-3.5 py-4`}
      >
        <div className="flex justify-between">
          <h1 className="!text-[14px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {isContainer ? (
              <IconBox size={20} className="inline mt-[-2px]" />
            ) : (
              <IconTag size={20} className="inline mt-[-2px]" />
            )}{" "}
            {item?.name}
          </h1>

          {showDelete ? (
            <div className="mt-[-10px]">
              {isSelected ? (
                <IconCircleMinus
                  className="text-white bg-danger rounded-full w-7 h-7"
                  aria-label="Unselected"
                />
              ) : (
                <IconCircleFilled
                  className="text-white opacity-50 w-7 h-7"
                  aria-label="Selected"
                />
              )}
            </div>
          ) : null}
        </div>
        <CountPills
          containerCount={isContainer ? data?.containers?.length : null}
          itemCount={isContainer ? data?.items?.length : item.items?.length}
          textClasses={"text-xs font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={isContainer}
          showFavorite
          showItems
          showEmpty={false}
          item={item}
          handleFavoriteClick={handleFavoriteClick}
          showDelete={showDelete}
          height
        />
      </div>
    </Card>
  );
};

export default ColorCard;
