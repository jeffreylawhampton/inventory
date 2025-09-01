import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DeleteSelector,
  Draggable,
  Favorite,
  LucideIcon,
} from "@/app/components";
import { LocationContext } from "../layout";
import { AccordionContext, DeviceContext, ModalContext } from "@/app/providers";
import { handleSidebarItemFavoriteClick } from "../handlers";
import { handleToggleDelete } from "../handlers";

const SidebarItem = ({ item, isOverlay }) => {
  item = { ...item, type: "item" };
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");

  const { selectedKey, layoutData } = useContext(LocationContext);

  const { showDelete } = useContext(ModalContext);
  const { activeItem, selectedObjects, setSelectedObjects } =
    useContext(AccordionContext);
  const { isMobile } = useContext(DeviceContext);

  const paddingLeft = item.depth * 24;

  const isSelectedForDeletion = selectedObjects?.find(
    (i) => i?.name === item.name
  );

  const isSelected = type === "item" && id == item.id;

  return (activeItem?.id === item?.id && !isOverlay) || !item ? null : (
    <Draggable
      activeItem={activeItem}
      id={item?.id}
      item={item}
      type="item"
      sidebar
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
        } ${isMobile ? "py-3" : "py-2.5"}`}
        style={{ paddingLeft }}
        onClick={
          showDelete
            ? () =>
                handleToggleDelete(
                  item,
                  "name",
                  selectedObjects,
                  setSelectedObjects
                )
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

          <Favorite
            item={item}
            size={16}
            onClick={() =>
              handleSidebarItemFavoriteClick({
                item,
                layoutData,
                selectedKey,
              })
            }
          />
        </span>
        {showDelete ? (
          <DeleteSelector isSelectedForDeletion={isSelectedForDeletion} />
        ) : null}
      </div>
    </Draggable>
  );
};

export default SidebarItem;
