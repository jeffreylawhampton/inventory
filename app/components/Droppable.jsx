"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ item, id, children }) {
  // todo: remove isContainer
  const isContainer = item.hasOwnProperty("parentContainerId");
  const type = item.hasOwnProperty("parentContainerId")
    ? "container"
    : "location";
  item = { ...item, type };
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { item, isContainer },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl ${isOver ? "brightness-75" : ""}`}
    >
      {children}
    </div>
  );
}
