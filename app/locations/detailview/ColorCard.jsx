"use client";
import useSWR from "swr";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { getTextColor, hexToHSL } from "../../lib/helpers";
import { IconBox } from "@tabler/icons-react";
import { fetcher } from "../../lib/fetcher";
import { LocationContext } from "../layout";
import { CountPills, Droppable } from "../../components";
import Draggable from "../Draggable";
import { handleCardFavoriteClick, handleContainerClick } from "../handlers";

const ColorCard = ({
  container,
  isSelected = true,
  data: pageData,
  fetchKey,
  isOverlay,
}) => {
  const {
    activeItem,
    openContainers,
    openLocations,
    setOpenContainers,
    setOpenLocations,
    showDelete,
  } = useContext(LocationContext);

  const router = useRouter();

  const [currentColor, setCurrentColor] = useState(
    container?.color?.hex || "#ececec"
  );
  const hoverColor = hexToHSL(container?.color?.hex);
  const { data } = useSWR(`/containers/api/${container.id}/counts`, fetcher);

  return activeItem?.name === container?.name && !isOverlay ? null : (
    // <Draggable id={container?.name} item={container}>
    //   <Droppable id={container.id} item={container}>
    <div
      className={`@container rounded-md dropshadow active:shadow-none p-3 relative ${
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
        onClick={() =>
          handleContainerClick({
            container,
            openLocations,
            setOpenLocations,
            openContainers,
            setOpenContainers,
            router,
          })
        }
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=container&id=${container.id}`)
            : null
        }
      />
      <div className="flex flex-col justify-between @260px:flex-row items-stretch @260px:items-center gap-2">
        <div className="flex gap-4 items-center w-full">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            <IconBox size={20} className="inline mt-[-2px] mr-1.5" />
            {container?.name}
          </h2>
        </div>
        <CountPills
          containerCount={data?.containers?.length}
          itemCount={data?.items?.length}
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
          showDelete={showDelete}
        />
      </div>
    </div>
    //   </Droppable>
    // </Draggable>
  );
};

export default ColorCard;
