"use client";
import useSWR from "swr";
import { useState } from "react";
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
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative ${
        showDelete && !isSelected ? "opacity-40" : ""
      }`}
      style={{
        backgroundColor: currentColor,
        color: getTextColor(item?.color?.hex) || "black",
      }}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(item?.color?.hex)}
      onClick={showDelete ? () => handleSelect(item.id) : null}
      aria-selected={isSelected}
    >
      {showDelete ? null : (
        <Link
          prefetch={false}
          href={
            isContainer ? `/containers/${item.id}` : `/categories/${item.id}`
          }
          className="w-full h-full absolute top-0 left-0"
        />
      )}
      <div className="flex flex-col justify-between @260px:flex-row items-start @260px:items-center gap-2">
        <div className="flex gap-4 items-center justify-between w-full">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {isContainer ? (
              <IconBox size={20} className="inline mt-[-2px]" />
            ) : (
              <IconTag size={20} className="inline mt-[-2px]" />
            )}{" "}
            {item?.name}
          </h2>

          {showDelete ? (
            <div className="">
              {isSelected ? (
                <IconCircleMinus
                  className="text-white bg-danger rounded-full w-6 h-6"
                  aria-label="Unselected"
                />
              ) : (
                <IconCircleFilled
                  className="text-white opacity-50 w-6 h-6"
                  aria-label="Selected"
                />
              )}
            </div>
          ) : (
            <div className="w-6 h-6" />
          )}
        </div>
        <CountPills
          containerCount={isContainer ? data?.containers?.length : null}
          itemCount={isContainer ? data?.items?.length : item._count?.items}
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
        />
      </div>
    </div>
  );
};

export default ColorCard;
