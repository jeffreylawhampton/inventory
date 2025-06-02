import { Button, Menu, Pill } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { v4 } from "uuid";
import { sortObjectArray } from "../lib/helpers";

const CategoryFilterButton = ({
  filters,
  setFilters,
  onClose,
  countItem = "items",
  label,
  showPills,
  className,
}) => {
  const { data } = useSWR(`/api/userCategories`, fetcher);
  const list = data?.categories?.filter((category) => category.items.length);
  const sorted = sortObjectArray(list);

  const handleSelectChange = (e, obj) => {
    setFilters(
      filters.includes(obj)
        ? filters.filter((filter) => filter != obj)
        : [...filters, obj]
    );
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
            Categories
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {sorted?.map((obj) => {
            return (
              <Menu.Item
                rightSection={
                  <div className="ml-7">{obj._count[countItem]}</div>
                }
                key={v4()}
                onClick={(e) => handleSelectChange(e, obj)}
                leftSection={
                  filters?.includes(obj) ? <IconCheck size={18} /> : null
                }
              >
                {obj.name}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
      {showPills ? (
        <div className="flex gap-2 !items-center flex-wrap">
          {filters?.map((filter) => {
            return (
              <Pill
                key={v4()}
                withRemoveButton
                onRemove={() => onClose(filter)}
                size="sm"
                classNames={{
                  label: "font-semibold lg:p-1",
                }}
                styles={{
                  root: {
                    height: "fit-content",
                  },
                }}
              >
                {filter?.name}
              </Pill>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CategoryFilterButton;
