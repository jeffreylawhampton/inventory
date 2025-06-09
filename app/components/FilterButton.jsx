import { Button, Menu } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { handleToggleDelete, sortObjectArray } from "../lib/helpers";
import { v4 } from "uuid";

const FilterButton = ({ filters, setFilters, options, label, className }) => {
  const sorted = sortObjectArray(options);

  const handleSelectChange = (e, obj) => {
    handleToggleDelete(obj, "name", filters, setFilters);
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <Menu
        shadow="md"
        closeOnItemClick={false}
        offset={0}
        position="bottom-start"
        classNames={{
          dropdown:
            "font-medium !py-4 !min-w-[200px] overflow-y-auto max-h-[400px]",
        }}
      >
        <Menu.Target>
          <Button
            variant={filters?.length ? "filled" : "outline"}
            color="black"
            classNames={{
              root: "min-w-fit max-lg:!p-3",
              label: "text-sm lg:text-base",
            }}
            rightSection={
              filters?.length ? (
                <IconX
                  aria-label="Clear all"
                  size={18}
                  onClick={() => setFilters([])}
                />
              ) : null
            }
          >
            {label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {sorted?.map((obj) => {
            return (
              <Menu.Item
                rightSection={<div className="ml-7">{obj?.count}</div>}
                key={v4()}
                onClick={(e) => handleSelectChange(e, obj)}
                leftSection={
                  filters?.find((i) => i.name === obj.name) ? (
                    <IconCheck size={18} />
                  ) : null
                }
              >
                {obj.name}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default FilterButton;
