import { useContext, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapse } from "@mantine/core";
import { checkSelected, sortObjectArray } from "../../lib/helpers";
import { ChevronRight } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { DeleteSelector, Draggable, LucideIcon } from "@/app/components";
import { AccordionContext, DeviceContext, ModalContext } from "@/app/providers";
import { SidebarItemCard } from "..";
import { handleToggleDelete } from "../handlers";

const ContainerAccordion = ({ container, isOverlay }) => {
  const base = useMemo(
    () => ({ ...container, type: "container" }),
    [container]
  );
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");

  const {
    activeItem,
    openLocationContainers,
    setOpenLocationContainers,
    selectedObjects,
    setSelectedObjects,
  } = useContext(AccordionContext);

  const droppableId = `con-${base.id}`;
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: { item: base },
  });

  const { showDelete } = useContext(ModalContext);
  const { isMobile } = useContext(DeviceContext);

  if ((activeItem?.name === base?.name && !isOverlay) || !base) return null;

  const paddingLeft = (base?.depth ?? 0) * 24;
  const isOpen = !isOverlay && openLocationContainers?.includes(base?.name);
  const isSelected = type === "container" && id == base.id;
  const isSelectedForDeletion = checkSelected(base, selectedObjects);

  const toggleOpen = () => {
    setOpenLocationContainers(
      isOpen
        ? openLocationContainers.filter((name) => name !== base.name)
        : [...openLocationContainers, base.name]
    );
  };

  return (
    <Draggable id={base?.id} item={base} sidebar isOverlay={isOverlay}>
      <div ref={setNodeRef}>
        <div
          role="button"
          tabIndex={0}
          className={`font-semibold text-[15px] relative w-full pl-1.5 pr-3 flex items-center justify-between gap-2 rounded ${
            isOver
              ? "bg-primary-500"
              : showDelete
              ? isSelectedForDeletion
                ? "bg-danger-200/80"
                : "opacity-60 hover:bg-danger-200/30"
              : isSelected
              ? "bg-primary-200"
              : "hover:bg-primary-100 peer-hover:bg-primary-100"
          } ${isMobile ? "py-3" : "py-2.5"}`}
          style={{ paddingLeft }}
          onClick={
            showDelete
              ? () =>
                  handleToggleDelete(
                    base,
                    "name",
                    selectedObjects,
                    setSelectedObjects
                  )
              : () => router.push(`?type=container&id=${base.id}`)
          }
          onKeyDown={(e) =>
            e.key === "Enter"
              ? router.push(`?type=container&id=${base.id}`)
              : null
          }
        >
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
            disabled={!base.containers?.length && !base.items?.length}
            className={`absolute peer z-10 disabled:opacity-0 rounded ${
              isSelected ? "hover:bg-primary-300" : "hover:bg-primary-200"
            } ${isMobile ? "p-1 ml-0.5 top-2" : "p-0.5 top-2.5"}`}
            style={{ left: paddingLeft }}
          >
            <ChevronRight
              aria-label={isOpen ? "Collapse container" : "Expand container"}
              size={isMobile ? 22 : 18}
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-90" : ""
              } pointer-events-none`}
            />
          </button>

          <span
            className={`flex gap-2 items-center ${isMobile ? "pl-9" : "pl-6"}`}
          >
            <LucideIcon
              fill={base?.color?.hex}
              size={20}
              stroke="black"
              type="container"
              iconName={base?.icon ?? "Box"}
            />
            <h3 className="text-nowrap">{base.name}</h3>
          </span>

          {showDelete ? (
            <DeleteSelector isSelectedForDeletion={isSelectedForDeletion} />
          ) : null}
        </div>
      </div>

      <Collapse in={isOpen} keepMounted aria-expanded={isOpen}>
        <ul>
          {base?.items?.map((item) => {
            const next = { ...item, depth: (base.depth ?? 0) + 1 };
            return (
              <SidebarItemCard item={next} key={`sidebar-item-${item.id}`} />
            );
          })}
          {base?.containers &&
            sortObjectArray(base.containers).map((child) => (
              <ContainerAccordion
                container={child}
                key={`sidebar-con-${child.id}`}
              />
            ))}
        </ul>
      </Collapse>
    </Draggable>
  );
};

export default ContainerAccordion;
