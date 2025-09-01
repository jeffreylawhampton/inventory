"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ item, id, children, disabled }) {
  const isContainer = item.hasOwnProperty("parentContainerId");
  const type = item.hasOwnProperty("parentContainerId")
    ? "container"
    : "location";
  item = { ...item, type };
  const { isOver, setNodeRef } = useDroppable({
    id: `type${id}`,
    data: { item, isContainer },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={`!h-fit rounded ${
        isOver && !disabled ? "!brightness-75" : ""
      }`}
    >
      {children}
    </div>
  );
}
