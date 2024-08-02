"use client";
import { Checkbox } from "@nextui-org/react";
import { v4 } from "uuid";

const CategoryToggle = ({ category }) => {
  // const bg = `bg-[${category.color}]`;
  return (
    <Checkbox
      radius="full"
      dir="right"
      value={category.id}
      className="rounded-full flex flex-row-reverse"
      style={{
        backgroundColor: category.color,
      }}
      classNames={{
        base: `data-[selected=true]:bg-opacity-100 data-[selected=false]:opacity-20`,
        label: "data-[selected=true]:text-white",
      }}
    >
      {category.name}
    </Checkbox>
  );
};

export default CategoryToggle;
