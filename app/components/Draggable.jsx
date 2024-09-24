"use client";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { getFontColor } from "../lib/helpers";

export default function Draggable({ id, item, children, activeItem }) {
  // todo: remove iscontainer
  const isContainer = item.hasOwnProperty("parentContainerId");
  const type = item.hasOwnProperty("parentContainerId") ? "container" : "item";
  item = { ...item, type };
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { item, isContainer },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={`touch-none relative ${
        activeItem?.id == item.id ? "hidden" : ""
      } ${isDragging ? "!drop-shadow-xl" : ""}`}
      ref={setNodeRef}
    >
      <IconGripVertical
        size={isDragging ? 0 : 30}
        {...listeners}
        {...attributes}
        style={style}
        className={`touch-none cursor-grab absolute top-[22px] left-2 z-50 ${
          isContainer ? getFontColor(item?.color?.hex) : "text-black !top-[30%]"
        }`}
      />
      {children}
    </div>
  );
}
