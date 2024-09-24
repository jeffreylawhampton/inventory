import { Button, Menu, Pill } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { v4 } from "uuid";

const FilterButton = ({
  filters,
  setFilters,
  label,
  onClose,
  countItem = "items",
  showPills,
  className,
}) => {
  const { data } = useSWR(`/api/user${label}`, fetcher);

  const list = data?.[label.toLowerCase()];

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
        width={240}
        closeOnItemClick={false}
        offset={0}
        position="bottom-start"
        classNames={{ dropdown: "font-medium !py-4" }}
      >
        <Menu.Target>
          <Button
            variant={filters?.length ? "filled" : "outline"}
            color="primary.7"
            classNames={{
              root: "min-w-fit",
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
          {list?.map((obj) => {
            return (
              <Menu.Item
                rightSection={<div>{obj._count[countItem]}</div>}
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

export default FilterButton;
