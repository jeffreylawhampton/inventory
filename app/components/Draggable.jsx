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
  color = "var(--mantine-color-bluegray-6)",
  top = "top-3.5",
  left = "left-1",
  disabled = false,
}) {
  const { isMobile } = useContext(DeviceContext);
  const enrichedItem = { ...item, type, sidebar };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: type + id,
    data: { item: enrichedItem },
    disabled,
  });

  return (
    <li
      className={`list-none relative  ${
        disabled ? "cursor-pointer" : "cursor-grab"
      } ${isOverlay ? "!bg-bluegray-100 rounded" : ""}
        ${isMobile ? null : `touch-none w-full h-fit relative ${classes}`}`}
      {...(!isMobile && { ...attributes })}
      {...(!isMobile && { ...listeners })}
      ref={setNodeRef}
    >
      {isMobile ? (
        <GripVertical
          size={18}
          color={color}
          {...listeners}
          {...attributes}
          className={`${
            disabled ? "opacity-0" : ""
          } touch-none absolute z-50 ${top} ${left}`}
        />
      ) : null}

      {children}
    </li>
  );
}
