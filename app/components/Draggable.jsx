"use client";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { getFontColor } from "../lib/helpers";

export default function Draggable({ id, item, children, activeItem }) {
  const isContainer = item.hasOwnProperty("parentContainerId");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { item },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={`relative ${activeItem?.id == item.id ? "hidden" : ""} ${
        isDragging ? "drop-shadow-xl" : ""
      }`}
      ref={setNodeRef}
    >
      <IconGripVertical
        size={isDragging ? 0 : 30}
        {...listeners}
        {...attributes}
        style={style}
        className={`cursor-grab absolute top-[27px] left-2 z-50 ${
          isContainer ? getFontColor(item?.color?.hex) : "text-black !top-10"
        }`}
      />
      {children}
    </div>
  );
}
