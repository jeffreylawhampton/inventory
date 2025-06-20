import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Draggable from "../Draggable";
import { DeleteSelector } from "@/app/components";
import { LocationContext } from "../layout";
import { DeviceContext } from "@/app/layout";
import LucideIcon from "@/app/components/LucideIcon";

const SidebarItem = ({ item, isOverlay }) => {
  item = { ...item, type: "item" };
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");

  const {
    activeItem,
    selectedForDeletion,
    handleSelectForDeletion,
    showDelete,
    selectedKey,
    layoutData,
  } = useContext(LocationContext);

  const { isMobile } = useContext(DeviceContext);

  const paddingLeft = item.depth * 24;

  const isSelectedForDeletion = selectedForDeletion?.find(
    (i) => i?.name === item.name
  );

  const isSelected = type === "item" && id == item.id;

  return (activeItem?.id === item?.id && !isOverlay) || !item ? null : (
    <Draggable
      activeItem={activeItem}
      id={item?.id}
      item={item}
      isSelected={isSelected}
      type="item"
      sidebar
      classes="my-1"
      isOverlay={isOverlay}
    >
      <div
        role="button"
        tabIndex={0}
        className={`font-semibold text-[15px] relative w-full p-1.5 pr-3 flex items-center justify-between rounded ${
          showDelete
            ? isSelectedForDeletion
              ? "bg-danger-200/80"
              : "opacity-60 hover:bg-danger-200/30"
            : isSelected
            ? "bg-primary-200"
            : "hover:bg-primary-100"
        } ${isMobile ? "py-3" : ""}`}
        style={{ paddingLeft }}
        onClick={
          showDelete
            ? () => handleSelectForDeletion(item)
            : () => router.push(`?type=item&id=${item.id}`)
        }
        onKeyDown={(e) =>
          e.key === "Enter" ? router.push(`?type=item&id=${item.id}`) : null
        }
      >
        <span
          className={`flex gap-2 items-center ${isMobile ? "pl-9" : "pl-6"}`}
        >
          <LucideIcon
            size={18}
            iconName={item?.icon}
            type="item"
            fill="none"
            stroke="black"
          />
          <h3 className="text-nowrap">{item.name}</h3>
        </span>
        {showDelete ? (
          <DeleteSelector isSelectedForDeletion={isSelectedForDeletion} />
        ) : null}
      </div>
    </Draggable>
  );
};

export default SidebarItem;
