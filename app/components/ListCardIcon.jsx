import { LucideIcon } from ".";
import { getTextColor } from "../lib/helpers";

const ListCardIcon = ({ item, type, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-md p-1 w-9 h-9 lg:h-8 lg:w-8 ${
        !isSelected && "hover:brightness-80"
      }`}
      style={{
        backgroundColor: isSelected
          ? null
          : item?.color?.hex ?? "var(--mantine-color-bluegray-0)",
      }}
    >
      <LucideIcon
        iconName={item?.icon}
        type={type}
        fill="transparent"
        stroke={
          type === "item"
            ? isSelected
              ? "white"
              : "black"
            : getTextColor(item?.color?.hex)
        }
        size={18}
      />
    </div>
  );
};

export default ListCardIcon;
