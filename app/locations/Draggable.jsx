"use client";
import { useContext } from "react";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { DeviceContext } from "../layout";

export default function Draggable({
  id,
  item = {},
  children,
  type = "container",
  classes = "",
  sidebar,
  isOverlay,
}) {
  const { isMobile } = useContext(DeviceContext);
  const enrichedItem = { ...item, type, sidebar };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: type + id,
    data: { item: enrichedItem },
  });

  return (
    <li
      className={`list-none relative ${
        isOverlay ? "!bg-bluegray-100 rounded" : ""
      }
        ${isMobile ? null : `touch-none w-full h-full relative ${classes}`}`}
      {...(!isMobile && { ...attributes })}
      {...(!isMobile && { ...listeners })}
      ref={setNodeRef}
    >
      {isMobile ? (
        <IconGripVertical
          size={20}
          color="var(--mantine-color-bluegray-6)"
          {...listeners}
          {...attributes}
          className="touch-none cursor-grab absolute top-3.5 left-1 z-50"
        />
      ) : null}

      {children}
    </li>
  );
}
