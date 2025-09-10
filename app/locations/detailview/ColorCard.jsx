"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { getTextColor, hexToHSL } from "@/app/lib/helpers";
import { LocationContext } from "../layout";
import { CountPills, LucideIcon } from "@/app/components";
import { handleCardFavoriteClick } from "../handlers";
import { ModalContext } from "@/app/providers";
const ColorCard = ({
  container,
  isSelected = true,
  data: pageData,
  fetchKey,
  isOverlay,
  handleClick,
}) => {
  const { activeItem } = useContext(LocationContext);
  const { showDelete } = useContext(ModalContext);

  const router = useRouter();

  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex);

  return activeItem?.name === container?.name && !isOverlay ? null : (
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative flex gap-3 ${
        showDelete && !isSelected ? "opacity-40" : ""
      }`}
      onMouseEnter={() => setCurrentColor(hoverColor)}
      onMouseLeave={() => setCurrentColor(container?.color?.hex)}
      style={{
        backgroundColor: currentColor,
        color: getTextColor(container?.color?.hex) || "black",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        onClick={() => handleClick(container)}
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=container&id=${container.id}`)
            : null
        }
      />
      <div className="w-full flex flex-col gap-2 @260px:flex-row items-stretch @260px:items-center flex-wrap">
        <div className="flex items-center w-full ml-1 mr-2">
          <LucideIcon
            iconName={container.icon}
            type="container"
            fill="transparent"
            stroke={getTextColor(container.color?.hex)}
            size={18}
          />
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] ml-1.5 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {container?.name}
          </h2>
        </div>
        <CountPills
          containerCount={container?.containerCount}
          itemCount={container?.itemCount}
          textClasses={"text-xs font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={true}
          showFavorite
          showItems
          showEmpty={false}
          item={container}
          handleFavoriteClick={() =>
            handleCardFavoriteClick({
              item: container,
              type: "container",
              key: fetchKey,
              data: pageData,
            })
          }
        />
      </div>
    </div>
  );
};

export default ColorCard;
