"use client";
import { useEffect, useRef } from "react";
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

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
    data: { item },
  });

  useEffect(() => {
    const el = ref.current;
    let touchStartTime = null;

    const handleTouchStart = () => {
      touchStartTime = Date.now();
    };

    const handleTouchEnd = () => {
      const elapsed = Date.now() - touchStartTime;
      if (elapsed < 200) {
        onClick?.();
      }
    };

    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (el) {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [onClick]);

  return (
    <li
      ref={(node) => {
        setNodeRef(node);
        ref.current = node;
      }}
      {...listeners}
      {...attributes}
      className={`list-none ${classes} w-full h-full relative`}
      tabIndex={-1}
    >
      {children}
    </li>
  );
}
