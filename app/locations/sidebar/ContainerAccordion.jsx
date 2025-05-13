import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapse } from "@mantine/core";
import { sortObjectArray } from "../../lib/helpers";
import Draggable from "../Draggable";
import { IconChevronRight, IconBox } from "@tabler/icons-react";
import { LocationContext } from "../layout";
import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./SidebarItem";
import ClosedBoxIcon from "../../assets/ClosedBoxIcon";
import DeleteSelector from "../DeleteSelector";

const ContainerAccordion = ({ container, isOverlay }) => {
  container = { ...container, type: "container" };
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");

  const {
    openContainers,
    setOpenContainers,
    activeItem,
    selectedForDeletion,
    handleSelectForDeletion,
    showDelete,
  } = useContext(LocationContext);

  const paddingLeft = container?.depth * 24;

  const isOpen = openContainers?.includes(container?.name);
  const isSelected = type === "container" && id == container.id;

  const isSelectedForDeletion = selectedForDeletion?.find(
    (c) => c.name === container.name
  );

  const handleContainerClick = () => {
    setOpenContainers(
      isOpen
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
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
      isSelected={isSelected}
      sidebar
      classes="my-1"
    >
      <button
        onClick={handleContainerClick}
        disabled={!container.containers?.length && !container.items?.length}
        className={`absolute top-2 peer z-10 disabled:opacity-0 p-0.5 rounded ${
          isSelected ? "hover:bg-primary-300" : "hover:bg-primary-200"
        } `}
        style={{ left: paddingLeft }}
      >
        <IconChevronRight
          aria-label={isOpen ? "Collapse container" : "Expand container"}
          size={16}
          strokeWidth={3}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <div
        role="button"
        tabIndex={0}
        ref={setNodeRef}
        className={`font-semibold text-[15px] relative w-full p-1.5 flex items-center justify-between gap-2 rounded ${
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
            ? () => handleSelectForDeletion(container)
            : () => router.push(`?type=container&id=${container.id}`)
        }
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=container&id=${container.id}`)
            : null
        }
      >
        <span className="flex gap-1 items-center pl-6">
          <IconBox size={20} fill={container.color?.hex} />
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
            return <DraggableItem item={item} key={"sidebar" + item.name} />;
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
