"use client";
import { Button, CheckIcon, Menu } from "@mantine/core";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

const LocationFilter = ({ locationFilters, setLocationFilters }) => {
  const { data } = useSWR("/api/userLocations", fetcher);

  const locations = data?.locations;
  const handleSelectChange = (e, location) => {
    setLocationFilters(
      locationFilters.includes(location)
        ? locationFilters.filter((id) => id != location)
        : [...locationFilters, location]
    );
  };

  return locations?.length ? (
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
            variant="filled"
            color="primary.7"
            classNames={{
              root: "min-w-fit",
            }}
          >
            Filter
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {locations?.map((location) => (
            <Menu.Item
              rightSection={<div>{location._count.containers}</div>}
              key={location.id}
              onClick={(e) => handleSelectChange(e, location.id)}
              leftSection={
                locationFilters?.includes(location.id) ? (
                  <CheckIcon size={12} />
                ) : null
              }
            >
              {location.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  ) : null;
};

export default LocationFilter;
