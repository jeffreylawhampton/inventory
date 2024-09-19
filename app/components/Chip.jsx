import { Chip } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const FilterChip = ({ value, children }) => {
  return (
    <Chip
      value={value}
      radius="xl"
      size="lg"
      classNames={{
        label: "font-semibold !text-[14px]",
        iconWrapper: "!overflow-visible",
      }}
      icon={<IconCircleCheckFilled className="text-white" />}
    >
      {children}
    </Chip>
  );
};

export default FilterChip;
