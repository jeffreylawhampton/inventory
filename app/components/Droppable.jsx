"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props) {
  const { item } = props;
  const isContainer = item.hasOwnProperty("parentContainerId");
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { item, isContainer },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl ${isOver ? "brightness-75" : ""}`}
    >
      {props.children}
    </div>
  );
}
