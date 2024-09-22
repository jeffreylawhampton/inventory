"use client";
import { v4 } from "uuid";
import { Button, CheckIcon, Menu } from "@mantine/core";
import CategoryPill from "./CategoryPill";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

const FilterButton = ({ setSelected, selected }) => {
  const { data } = useSWR("/api/userCategories", fetcher);

  const categories = data?.categories;
  const handleSelectChange = (e, category) => {
    setSelected(
      selected.includes(category)
        ? selected.filter((id) => id != category)
        : [...selected, category]
    );
  };
  const onClose = (e) => {
    setSelected(selected.filter((category) => category != e));
  };

  return categories?.length ? (
    <div className="flex w-full items-start gap-2 mb-4">
      <Menu
        shadow="md"
        width={200}
        closeOnItemClick={false}
        offset={0}
        position="bottom-start"
        classNames={{ dropdown: "font-medium" }}
      >
        <Menu.Target>
          <Button
            variant="outline"
            classNames={{
              root: "min-w-fit",
            }}
          >
            Category
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {categories?.map((category) => (
            <Menu.Item
              rightSection={<div>{category._count.items}</div>}
              key={category.id}
              onClick={(e) => handleSelectChange(e, category.id)}
              leftSection={
                selected?.includes(category.id) ? <CheckIcon size={12} /> : null
              }
            >
              {category.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      {/* <div className="flex gap-2 !items-center flex-wrap">
        {selected?.map((id) => {
          const category = categories?.find((category) => category?.id == id);
          return (
            <CategoryPill
              key={v4()}
              removable
              category={category}
              isCloseable={true}
              onClose={() => onClose(category?.id)}
              size="sm"
            />
          );
        })}
        {selected?.length > 1 ? (
          <Button variant="subtle" onClick={() => setSelected([])}>
            Clear
          </Button>
        ) : null}
      </div> */}
    </div>
  ) : null;
};

export default FilterButton;
