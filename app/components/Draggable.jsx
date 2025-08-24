"use client";
import { useContext } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { DeviceContext } from "../providers";

export default function Draggable({
  id,
  item = {},
  children,
  type = "container",
  classes = "",
  sidebar,
  isOverlay,
  disabled = false,
}) {
  const enrichedItem = { ...item, type, sidebar };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: type + id,
    data: { item: enrichedItem },
    disabled,
  });

  return (
    <li
      className={`list-none relative ${classes} ${
        disabled ? "cursor-pointer" : "cursor-grab"
      } ${isOverlay ? "!bg-bluegray-100 rounded" : ""}
      `}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children}
    </li>
  );
}
