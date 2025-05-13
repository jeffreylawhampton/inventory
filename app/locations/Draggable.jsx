"use client";
import { useDraggable } from "@dnd-kit/core";

export default function Draggable({
  id,
  item,
  children,
  type = "container",
  classes,
  onClick,
  sidebar = false,
}) {
  item = { ...item, type, sidebar };
  if (type === "container")
    item = {
      ...item,
      parentContainerId: item.parentContainer?.id,
      locationId: item.location?.id,
    };
  const { attributes, listeners, setNodeRef, over } = useDraggable({
    id: id,
    data: { item },
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`list-none ${classes} w-full h-full relative`}
      tabIndex={-1}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
