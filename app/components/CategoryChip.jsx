import { Chip } from "@nextui-org/react";
import { checkLuminance } from "../lib/helpers";

const CategoryChip = ({ category, isCloseable = false, onClose }) => {
  return (
    <Chip
      style={{
        backgroundColor: category?.color,
        color: checkLuminance(category?.color),
      }}
      classNames={{
        content: `font-medium ${isCloseable ? "text-sm" : "text-[11px]"}`,
        base: `${isCloseable ? "pl-1 pr-2" : "p-0"} bg-opacity-50 rounded-lg`,
      }}
      isCloseable={isCloseable}
      onClose={onClose ? onClose : null}
    >
      {category?.name}
    </Chip>
  );
};

export default CategoryChip;
