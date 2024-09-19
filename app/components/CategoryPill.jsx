import { Pill } from "@mantine/core";
import { checkLuminance } from "../lib/helpers";
import { v4 } from "uuid";

const CategoryPill = ({
  category,
  removable = false,
  onClose,
  size = "sm",
}) => {
  return (
    <Pill
      key={v4()}
      withRemoveButton={removable}
      onRemove={onClose}
      size={size}
      classNames={{
        label: "font-semibold lg:p-1",
      }}
      styles={{
        root: {
          backgroundColor: category?.color?.hex,
          color: checkLuminance(category?.color?.hex),
          height: "fit-content",
        },
      }}
    >
      {category?.name}
    </Pill>
  );
};

export default CategoryPill;
