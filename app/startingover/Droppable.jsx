"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props) {
  const { item } = props;
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { item },
  });
  const style = {
    backgroundColor: isOver ? "#ececec" : "#f8f8f8",
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
