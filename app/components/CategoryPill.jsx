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
  link = true,
}) => {
  return (
    <Pill
      key={v4()}
      href={link ? `/categories/${category.id}` : null}
      component={link ? "a" : null}
      withRemoveButton={removable}
      onRemove={onClose}
      size={size}
      classNames={{
        label: "font-semibold lg:p-1 flex items-center gap-[2px]",
        root: `relative ${link ? "hover:brightness-90" : ""}`,
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
