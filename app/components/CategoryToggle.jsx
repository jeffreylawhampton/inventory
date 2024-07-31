"use client";
import { Checkbox } from "@nextui-org/react";
import { v4 } from "uuid";

const CategoryToggle = ({ category, isSelected }) => {
  return (
    <Checkbox
      radius="full"
      dir="right"
      value={category.id}
      style={
        isSelected
          ? { backgroundColor: category.color, color: "white" }
          : { backgroundColor: "#ececec", color: "black" }
      }
      className="rounded-full flex flex-row-reverse"
    >
      {category.name}
    </Checkbox>
  );
};

export default CategoryToggle;
