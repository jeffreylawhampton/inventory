import { Pill } from "@mantine/core";
import { Heart } from "lucide-react";
const FilterPill = ({ item, icon, onClose }) => {
  return (
    <Pill
      withRemoveButton
      classNames={{
        root: "!bg-bluegray-200/70 hover:!bg-bluegray-300/80 active:!bg-bluegray-400/70",
        label: `flex gap-1 font-semibold items-center text-xs ${
          item?.id ? "[&>svg]:!fill-primary-400" : null
        }`,
        remove: "[&>svg]:!w-3.5",
      }}
      size="lg"
      onRemove={() => onClose(item?.id ? item?.id : false)}
    >
      {icon ? icon : <Heart size={14} fill="var(--mantine-color-danger-5)" />}
      {item?.name ?? "Favorites"}
    </Pill>
  );
};

export default FilterPill;
