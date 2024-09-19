import { Button, Chip } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { v4 } from "uuid";

const LocationFilters = ({
  locationList,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  handleCheck,
}) => {
  return (
    <div
      className={`cursor-pointer overflow-hidden transition-all mt-4 mb-2 ${
        showFilters ? "max-h-[300px]" : "max-h-9"
      }`}
    >
      <Button
        variant="subtle"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-2"
      >
        {showFilters ? "Hide filters" : "Show filters"}
      </Button>
      <div className="flex flex-wrap gap-1 mb-3">
        <Chip.Group multiple value={filters} onChange={setFilters}>
          {locationList.map((location) => {
            return (
              <Chip
                key={v4()}
                checked={filters?.includes(location?.id)}
                onChange={() => handleCheck(location.id)}
                variant="filled"
                radius="xl"
                size="lg"
                classNames={{
                  label: "font-semibold !text-[14px]",
                  iconWrapper: "!overflow-visible",
                }}
                icon={<IconCircleCheckFilled className="text-white" />}
              >
                {location.name}
              </Chip>
            );
          })}
        </Chip.Group>
      </div>
      <Button
        variant="subtle"
        onClick={() => setFilters(locationList.map((location) => location.id))}
      >
        Show all
      </Button>
      <Button variant="subtle" onClick={() => setFilters([])}>
        Clear
      </Button>
    </div>
  );
};

export default LocationFilters;
