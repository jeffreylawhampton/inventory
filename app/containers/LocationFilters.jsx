import { Button, Menu, Pill } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { v4 } from "uuid";
import { useUser } from "../hooks/useUser";
import { sortObjectArray } from "../lib/helpers";

const LocationFilters = ({
  activeFilters,
  setActiveFilters,
  showCounts = true,
}) => {
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
            variant="outline"
            color="black"
            classNames={{
              root: "min-w-fit",
            }}
          >
            Location
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {locationList?.map((location) => (
            <Menu.Item
              rightSection={
                showCounts ? <div>{location._count.containers}</div> : null
              }
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
      {user?.locations?.length ? (
        <div className="flex gap-2 !items-center flex-wrap">
          {activeFilters?.map((id) => {
            const location = locationList?.find(
              (location) => location?.id == id
            );
            return (
              <Pill
                key={v4()}
                withRemoveButton
                onRemove={() => onClose(id)}
                size="sm"
                classNames={{
                  label: "font-semibold lg:p-1",
                  remove: "hover:scale-[115%] transition ",
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
      ) : null}
    </div>
  );
};

export default LocationFilters;
