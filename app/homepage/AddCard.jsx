import useSWR from "swr";
import { v4 } from "uuid";
import { getTextColor } from "../lib/helpers";
import { CountPills, CategoryPill } from "@/app/components";
import {
  IconCircleCheck,
  IconCircleFilled,
  IconBox,
  IconTag,
} from "@tabler/icons-react";
import { fetcher } from "../lib/fetcher";

const AddCard = ({
  item,
  isSelected,
  selectedItems,
  setSelectedItems,
  type,
}) => {
  const isContainer = item?.hasOwnProperty("parentContainerId");
  const isItem = item?.hasOwnProperty("containerId");

  const { data } = useSWR(
    isContainer ? `/containers/api/${item.id}/counts` : null,
    fetcher
  );

  const handleSelect = () => {
    setSelectedItems(
      isSelected
        ? selectedItems.filter((i) => i != item.id)
        : [...selectedItems, item.id]
    );
  };

  return (
    <div
      className={`@container rounded-md shadow-sm active:shadow-none p-3 relative bg-bluegray-200/80 ${
        !isSelected ? "opacity-40" : ""
      }`}
      style={{
        backgroundColor: item?.color?.hex,
        color: isItem ? "black" : getTextColor(item?.color?.hex) || "black",
      }}
      onClick={() => handleSelect(item.id)}
      aria-selected={isSelected}
    >
      <div className="flex flex-col justify-between @260px:flex-row items-start @260px:items-center gap-2">
        <div className="flex gap-4 items-center justify-between w-full">
          <h2 className="!text-[13px] @2xs:!text-[14px] @xs:!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words">
            {isItem ? null : isContainer ? (
              <IconBox size={20} className="inline mt-[-2px]" />
            ) : (
              <IconTag size={20} className="inline mt-[-2px]" />
            )}{" "}
            {item?.name}
          </h2>

          <div className="">
            {isSelected ? (
              <IconCircleCheck
                className="bg-white text-black rounded-full w-6 h-6"
                aria-label="Unselected"
              />
            ) : (
              <IconCircleFilled
                className="text-white opacity-50 w-6 h-6"
                aria-label="Selected"
              />
            )}
          </div>
        </div>
        {isItem ? (
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
        ) : (
          <CountPills
            containerCount={isContainer ? data?.containers?.length : null}
            itemCount={isContainer ? data?.items?.length : item._count.items}
            textClasses={"text-xs font-medium"}
            verticalMargin="my-0 !pl-0"
            transparent
            showContainers={isContainer}
            showFavorite
            showItems
            showEmpty={false}
            item={item}
            handleFavoriteClick={null}
            showDelete={true}
          />
        )}
      </div>
    </div>
  );
};

export default AddCard;
