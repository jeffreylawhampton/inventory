import { Button, Chip, Menu, Pill } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { v4 } from "uuid";
import { useUser } from "../hooks/useUser";
import { useContext } from "react";
import { ContainerFilterContext } from "./page";
import { sortObjectArray } from "../lib/helpers";

const LocationFilters = ({ activeFilters, setActiveFilters }) => {
  const { user } = useUser();

  const locationList = sortObjectArray(user?.locations);

  const handleSelectChange = (e, locationId) => {
    setActiveFilters(
      activeFilters.includes(locationId)
        ? activeFilters.filter((id) => id != locationId)
        : [...activeFilters, locationId]
    );
  };
  const onClose = (e) => {
    setActiveFilters(activeFilters.filter((locationId) => locationId != e));
  };

  return (
    <div className="flex w-full items-start gap-2 mb-4">
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
          <Menu.Label>Location</Menu.Label>
          {locationList?.map((location) => (
            <Menu.Item
              rightSection={<div>{location._count.containers}</div>}
              key={location.id}
              onClick={(e) => handleSelectChange(e, location.id)}
              leftSection={
                activeFilters?.includes(location.id) ? (
                  <IconCheck size={18} />
                ) : null
              }
            >
              {location.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <div className="flex gap-2 !items-center flex-wrap">
        {activeFilters?.map((id) => {
          const location = locationList?.find((location) => location?.id == id);
          return (
            <Pill
              key={v4()}
              withRemoveButton={true}
              onRemove={() => onClose(id)}
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
              {location?.name}
            </Pill>
          );
        })}
        {activeFilters?.length > 1 ? (
          <Button variant="subtle" onClick={() => setActiveFilters([])}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default LocationFilters;
