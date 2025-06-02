"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { CategoryPill, Favorite } from "@/app/components";
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

  return activeItem?.name === item?.name && !isOverlay ? null : (
    <div
      className={`cols-span-1 min-h-[81px] h-full group rounded-md overflow-hidden relative dropshadow-sm bg-bluegray-200 hover:bg-bluegray-300 border border-bluegray-200/80 hover:border-bluegray-300/90}`}
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
      <div className="py-2 pl-[16px] pr-3">
        <span className="flex gap-2 mb-[1px] justify-between items-center min-h-[28px]">
          <h2 className="flex gap-1.5 text-sm font-semibold leading-tight break-words hyphens-auto text-pretty mb-1">
            {item?.name}

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
              position=""
              size={16}
              classes=""
            />
          </h2>
        </span>
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
