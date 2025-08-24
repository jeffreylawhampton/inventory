import { useContext } from "react";
import LucideIcon from "./LucideIcon";
import { getTextColor } from "../lib/helpers";
import { DeviceContext } from "../providers";

const ListCardIcon = ({ item, type, onClick, isSelected }) => {
  const { isMobile } = useContext(DeviceContext);
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center rounded-md p-1 ${
        !isSelected && "hover:brightness-80"
      } ${isMobile ? "w-7 h-7" : "w-8 h-8"}`}
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
        classes="relative"
        size={18}
      />
    </div>
  );
};

export default ListCardIcon;
