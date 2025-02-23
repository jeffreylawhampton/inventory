import { Button, Menu, Pill } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { v4 } from "uuid";
import _, { indexOf } from "lodash";
import { groupBy } from "lodash";
import { sortObjectArray } from "../lib/helpers";

const LocationFilterButton = ({
  filters,
  setFilters,
  onClose,
  showPills,
  className,
  data,
}) => {
  const locationGroups = groupBy(data.items, "location.name");
  const pairs = Object.keys(locationGroups).map((location) => {
    return { name: location, count: locationGroups[location].length };
  });

  const sorted = sortObjectArray([...pairs]);
  const noLocation = sorted.find((loc) => loc.name === "undefined");
  if (noLocation) {
    sorted.splice(sorted.indexOf(noLocation), 1);
    sorted.push(noLocation);
  }

  const handleSelectChange = (e, loc) => {
    setFilters(
      filters.includes(loc)
        ? filters.filter((filter) => filter != loc)
        : [...filters, loc]
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
            "font-medium !py-4 min-w-[200px] w-fit overflow-y-auto max-h-[400px]",
        }}
      >
        <Menu.Target>
          <Button
            variant={filters?.length ? "filled" : "outline"}
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
            Locations
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {sorted.map((loc) => {
            return (
              <Menu.Item
                rightSection={<div className="ml-7">{loc.count}</div>}
                key={v4()}
                onClick={(e) => handleSelectChange(e, loc.name)}
                leftSection={
                  filters?.includes(loc.name) ? <IconCheck size={18} /> : null
                }
              >
                {loc.name === "undefined" ? "No location" : loc.name}
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
                {filter}
              </Pill>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default LocationFilterButton;
