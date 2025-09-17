import { Pill } from "@mantine/core";

import { getTextColor } from "../lib/helpers";
import { v4 } from "uuid";
import LucideIcon from "./LucideIcon";

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
        label: "font-semibold px-1 flex items-center !gap-1.5 text-[9px]",
        root: `!px-1.5 relative ${link ? "hover:brightness-90" : ""}`,
      }}
      styles={{
        root: {
          height: "fit-content",
          backgroundColor: category?.color?.hex,
          color: getTextColor(category?.color?.hex),
        },
      }}
    >
      {showTag ? (
        <LucideIcon
          iconName={category?.icon}
          type="category"
          fill="transparent"
          stroke={getTextColor(category?.color?.hex) ?? "black"}
          size={11}
        />
      ) : null}
      {category?.name}
    </Pill>
  );
};

export default CategoryPill;
