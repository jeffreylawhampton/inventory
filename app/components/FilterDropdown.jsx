"use client";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { checkLuminance } from "../lib/helpers";
import { v4 } from "uuid";
import CategoryChip from "./CategoryChip";

const FilterDropdown = ({ categories, setSelected, selected }) => {
  const handleSelectChange = (e) => {
    setSelected(Array.from(e));
  };
  const onClose = (e) => {
    setSelected(selected.filter((category) => category != e));
  };

  return (
    <div className="flex w-full max-w-xs items-center gap-2 mb-4">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" className="w-fit">
            Filter
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          selectionMode="multiple"
          onSelectionChange={handleSelectChange}
          closeOnSelect={false}
        >
          {categories?.map((category) => (
            <DropdownItem
              endContent={<div>{category._count.items}</div>}
              key={category.id}
            >
              {category.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <div className="flex gap-2 items-center">
        {selected?.map((id) => {
          const category = categories?.find((category) => category?.id == id);
          return (
            <CategoryChip
              key={v4()}
              category={category}
              isCloseable={true}
              onClose={() => onClose(category?.id)}
            />
          );
        })}
        {selected.length ? (
          <Button variant="light" onPress={() => setSelected([])}>
            Clear all
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default FilterDropdown;

{
  /* <Chip
style={{
  backgroundColor: category?.color,
  color: checkLuminance(category?.color),
}}
key={v4()}
isCloseable
onClose={() => onClose(category?.id)}
>
{category?.name}
</Chip> */
}
