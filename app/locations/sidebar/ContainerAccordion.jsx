import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapse } from "@mantine/core";
import { checkSelected, sortObjectArray } from "../../lib/helpers";
import { ChevronRight } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import SidebarItem from "./SidebarItem";
import { DeleteSelector, Draggable } from "@/app/components";
import { AccordionContext, DeviceContext, ModalContext } from "@/app/providers";
import LucideIcon from "@/app/components/LucideIcon";
import { handleToggleDelete } from "../handlers";

const ContainerAccordion = ({ container, isOverlay }) => {
  container = { ...container, type: "container" };
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

  const { showDelete } = useContext(ModalContext);

  const { isMobile } = useContext(DeviceContext);

  const paddingLeft = container?.depth * 24;

  const isOpen =
    !isOverlay && openLocationContainers?.includes(container?.name);
  const isSelected = type === "container" && id == container.id;

  const isSelectedForDeletion = checkSelected(container, selectedObjects);

  const handleContainerClick = () => {
    setOpenLocationContainers(
      isOpen
        ? openLocationContainers.filter((name) => name != container.name)
        : [...openLocationContainers, container.name]
    );
  };

  const { isOver, setNodeRef } = useDroppable({
    id: container.id,
    data: { item: container },
  });

  return (activeItem?.name === container?.name && !isOverlay) ||
    !container ? null : (
    <Draggable
      id={container?.id}
      item={container}
      sidebar
      isOverlay={isOverlay}
    >
      <button
        onPointerDown={handleContainerClick}
        disabled={!container.containers?.length && !container.items?.length}
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
          }`}
        />
      </button>
      <div
        role="button"
        tabIndex={0}
        ref={setNodeRef}
        className={`font-semibold text-[15px] relative w-full pl-1.5 pr-3 py-2.5 flex items-center justify-between gap-2 rounded ${
          isOver
            ? "bg-primary-500"
            : showDelete
            ? isSelectedForDeletion
              ? "bg-danger-200/80"
              : "opacity-60 hover:bg-danger-200/30"
            : isSelected
            ? "bg-primary-200"
            : "hover:bg-primary-100 peer-hover:bg-primary-100"
        }`}
        style={{ paddingLeft }}
        onClick={
          showDelete
            ? () =>
                handleToggleDelete(
                  container,
                  "name",
                  selectedObjects,
                  setSelectedObjects
                )
            : () => router.push(`?type=container&id=${container.id}`)
        }
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=container&id=${container.id}`)
            : null
        }
      >
        <span
          className={`flex gap-2 items-center ${isMobile ? "pl-9" : "pl-6"}`}
        >
          <LucideIcon
            fill={container?.color?.hex}
            size={20}
            stroke="black"
            type="container"
            iconName={container?.icon}
          />
          <h3 className="text-nowrap">{container.name}</h3>
        </span>
        {showDelete ? (
          <DeleteSelector isSelectedForDeletion={isSelectedForDeletion} />
        ) : null}
      </div>
      <Collapse in={isOpen} aria-expanded={isOpen}>
        <ul>
          {container?.items?.map((item) => {
            item = { ...item, depth: container.depth + 1 };
            return <SidebarItem item={item} key={"sidebar" + item.name} />;
          })}
          {container?.containers &&
            sortObjectArray(container.containers).map((childContainer) => (
              <ContainerAccordion
                container={childContainer}
                key={"sidebar" + childContainer.name}
              />
            ))}
        </ul>
      </Collapse>
    </Draggable>
  );
};

export default ContainerAccordion;
