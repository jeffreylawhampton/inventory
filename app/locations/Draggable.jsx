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

  const ref = useRef(null);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
    data: { item },
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let downTime = 0;

    const handleDown = () => {
      downTime = Date.now();
    };

    const handleUp = () => {
      const delta = Date.now() - downTime;
      if (delta < 200) {
        onClick?.();
      }
    };

    el.addEventListener("pointerdown", handleDown, { passive: true });
    el.addEventListener("pointerup", handleUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", handleDown);
      el.removeEventListener("pointerup", handleUp);
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
