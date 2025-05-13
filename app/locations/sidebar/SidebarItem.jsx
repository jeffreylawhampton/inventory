import React, { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Draggable from "../Draggable";
import DeleteSelector from "../DeleteSelector";
import { IconClipboardList } from "@tabler/icons-react";
import { LocationContext } from "../layout";

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
  } = useContext(LocationContext);

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
    >
      <div
        role="button"
        tabIndex={0}
        className={`font-semibold text-[15px] relative w-full p-1.5 flex items-center justify-between rounded ${
          showDelete
            ? isSelectedForDeletion
              ? "bg-danger-200/80"
              : "opacity-60 hover:bg-danger-200/30"
            : isSelected
            ? "bg-primary-200"
            : "hover:bg-primary-100"
        }`}
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
        <span className="flex gap-1 items-center pl-6">
          <IconClipboardList size={20} fill="var(--mantine-color-primary-1)" />
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
