import { Pill } from "@mantine/core";
import { checkLuminance } from "../lib/helpers";
import { v4 } from "uuid";
import { IconTag } from "@tabler/icons-react";

const CategoryPill = ({
  category,
  removable = false,
  onClose,
  size = "sm",
  showTag = false,
}) => {
  return (
    <Pill
      key={v4()}
      withRemoveButton={removable}
      onRemove={onClose}
      size={size}
      classNames={{
        label: "font-semibold lg:p-1 flex items-center gap-[2px]",
      }}
      styles={{
        root: {
          height: "fit-content",
          backgroundColor: category?.color?.hex,
          color: checkLuminance(category?.color?.hex),
        },
      }}
    >
      {showTag ? <IconTag aria-label="Category" size={16} /> : null}{" "}
      {category?.name}
    </Pill>
  );
};

export default CategoryPill;
