"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props) {
  const { item } = props;
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { item },
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
