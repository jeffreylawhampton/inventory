"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { checkLuminance } from "../lib/helpers";

export default function Droppable(props) {
  const { item } = props;
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { item },
  });
  const style = {
    // backgroundColor: isOver ? "#ececec" : item?.color || "#f8f8f8",
    color: item?.color ? checkLuminance(item.color) : "black",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#f4f4f4] ${props.className} ${isOver && "bg-bluegray-3"}`}
    >
      {props.children}
    </div>
  );
}
