import { Pill } from "@mantine/core";
import { LucideIcon, Tooltip } from ".";
import { getTextColor } from "../lib/helpers";
import { v4 } from "uuid";

const CategoryPill = ({
  category,
  removable = false,
  onClose,
  size = "sm",
  showTag = false,
  link = true,
  showName = true,
  textSize = "text-[9px]",
}) => {
  return (
    <Tooltip
      label={category?.name}
      hidden={showName}
      classNames={{ root: "relative" }}
      delay={200}
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
          label: `font-semibold flex items-center !gap-1.5 ${textSize} ${
            showName ? "px-1" : ""
          }`,
          root: `${showName ? "" : "!p-1"} relative ${
            link ? "hover:brightness-90" : ""
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
            size={11}
          />
        ) : null}
        {showName ? category?.name : null}
      </Pill>
    </Tooltip>
  );
};

export default CategoryPill;
