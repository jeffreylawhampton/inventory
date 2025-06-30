"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { CategoryPill, Favorite, ThumbnailIcon } from "@/app/components";
import { v4 } from "uuid";
import { handleCardFavoriteClick } from "../handlers";
import { LocationContext } from "../layout";

const ItemCard = ({ item, data, fetchKey, isOverlay }) => {
  const router = useRouter();
  const { activeItem, openContainers, setOpenContainers } =
    useContext(LocationContext);

  const selectItem = () => {
    if (!openContainers?.includes(item?.container?.name)) {
      setOpenContainers([...openContainers, item.container?.name]);
    }
    router.push(`?type=item&id=${item.id}`);
  };

  let featuredImage;
  if (item?.images?.length) {
    featuredImage = item?.images?.find((i) => i.featured) ?? item?.images[0];
  }

  return activeItem?.name === item?.name && !isOverlay ? null : (
    <div
      className={`cols-span-1 flex gap-3 p-2 min-h-[81px] h-full w-full group rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200 hover:bg-bluegray-300 border border-bluegray-200/80 hover:border-bluegray-300/90}`}
    >
      <div
        tabIndex={0}
        role="button"
        className="w-full h-full absolute left-0 top-0"
        onClick={selectItem}
        onKeyDown={(e) =>
          e.key === "Enter" ? router.push(`?type=item&id=${item.id}`) : null
        }
      />
      {featuredImage ? (
        <div className="rounded-md overflow-hidden w-1/4 h-full">
          <div
            className="w-full h-full"
            style={{
              background: `url(${featuredImage?.secureUrl}) center center / cover no-repeat`,
            }}
          />
        </div>
      ) : (
        <div className="w-1/4 p-2">
          <ThumbnailIcon
            type="item"
            iconName={item?.icon ?? "Layers"}
            stroke="#000"
            containerWidth="w-full h-full"
          />
        </div>
      )}
      <div className=" pr-3 w-full">
        <div className="flex gap-1 mb-1 items-center min-h-[28px] @container">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px]  pr-1 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {item?.name}
          </h2>
          <Favorite
            onClick={() =>
              handleCardFavoriteClick({
                item,
                key: fetchKey,
                data,
                type: "item",
              })
            }
            item={item}
            size={16}
          />
        </div>
        <div
          className={`flex gap-1 flex-wrap ${
            item?.categories?.length ? "mb-2" : ""
          }`}
        >
          {item?.categories?.map((category) => {
            return (
              <CategoryPill
                key={v4()}
                category={category}
                size="xs"
                link={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
