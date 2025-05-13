"use client";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { getTextClass } from "../lib/helpers";

export default function Draggable({ id, item, children, activeItem }) {
  const isContainer = item.hasOwnProperty("parentContainerId");
  const type = item.hasOwnProperty("parentContainerId") ? "container" : "item";
  item = { ...item, type };
  const { attributes, listeners, setNodeRef, transform, isDragging, over } =
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
      className={`relative ${
        isDragging ? "!drop-shadow-xl z-[100000] fixed" : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      <IconGripVertical
        size={20}
        {...listeners}
        {...attributes}
        className={`touch-none cursor-grab absolute top-[14px] left-2 z-50 ${
          isContainer ? getTextClass(item?.color?.hex) : "text-black"
        }`}
      />

      {children}
    </div>
  );
}
