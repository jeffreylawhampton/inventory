"use client";
import { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Draggable({
  id,
  item = {},
  children,
  type = "container",
  onClick,
  classes = "",
  sidebar,
}) {
  const ref = useRef(null);
  const pointerDownTime = useRef(null);

  const enrichedItem = { ...item, type, sidebar };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { item: enrichedItem },
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerDown = () => {
      pointerDownTime.current = Date.now();
    };

    const handlePointerUp = () => {
      const elapsed = Date.now() - pointerDownTime.current;
      if (elapsed < 200) {
        onClick?.();
      }
    };

    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerup", handlePointerUp);
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
      className={`list-none w-full h-full relative ${classes}`}
      style={{ touchAction: "none" }}
      tabIndex={-1}
    >
      {children}
    </li>
  );
}
