import { Pill } from "@mantine/core";
import { getTextColor } from "../lib/helpers";
import { v4 } from "uuid";
import LucideIcon from "./LucideIcon";
import Tooltip from "./Tooltip";

const CategoryPill = ({
  category,
  removable = false,
  onClose,
  size = "sm",
  showTag = false,
  link = true,
  showName = true,
}) => {
  return (
    <Tooltip
      label={category?.name}
      disabled={showName}
      position="top"
      withArrow
    >
      <Pill
        key={v4()}
        href={link ? `/categories/${category.id}` : null}
        component={link ? "a" : null}
        withRemoveButton={removable}
        onRemove={onClose}
        size={size}
        classNames={{
          label: "font-semibold px-1 flex items-center !gap-1.5 text-[9px]",
          root: `!px-1.5 relative ${link ? "hover:brightness-90" : ""} ${
            showName ? null : "!py-1 !px-1.5"
          }`,
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
            size={showName ? 11 : 14}
          />
        ) : null}
        {showName ? category?.name : null}
      </Pill>
    </Tooltip>
  );
};

export default CategoryPill;
