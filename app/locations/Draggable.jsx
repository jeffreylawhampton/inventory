"use client";
import { useDraggable } from "@dnd-kit/core";

export default function Draggable({
  id,
  item = {},
  children,
  type = "container",
  classes = "",
  sidebar,
}) {
  const enrichedItem = { ...item, type, sidebar };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { item: enrichedItem },
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none list-none w-full h-full relative ${classes}`}
      tabIndex={-1}
    >
      {children}
    </li>
  );
}
