"use client";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { getFontColor } from "../lib/helpers";

export default function Draggable({ id, item, children, activeItem }) {
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
      className={`relative ${activeItem?.id == item.id ? "opacity-0" : ""}`}
      ref={setNodeRef}
    >
      <IconGripVertical
        size={isDragging ? 0 : 38}
        {...listeners}
        {...attributes}
        style={style}
        className={`touch-none cursor-grab absolute top-5 left-2 z-50 ${getFontColor(
          item?.color?.hex
        )}`}
      />
      {children}
    </div>
  );
}
