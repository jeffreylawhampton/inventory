import { Pill } from "@mantine/core";
import { getTextColor } from "../lib/helpers";
import { v4 } from "uuid";
import { Tag } from "lucide-react";

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
        label: "font-semibold px-[2px] py-[1px] flex items-center gap-[2px]",
        root: `!px-2 relative ${link ? "hover:brightness-90" : ""}`,
      }}
      styles={{
        root: {
          height: "fit-content",
          backgroundColor: category?.color?.hex,
          color: getTextColor(category?.color?.hex),
        },
      }}
    >
      {showTag ? <Tag aria-label="Category" size={12} /> : null}{" "}
      {category?.name}
    </Pill>
  );
};

export default CategoryPill;
