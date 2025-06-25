import { useRef } from "react";
import { Popover } from "@mantine/core";
import HoverItem from "./HoverItem";
import HoverColorCard from "./HoverColorCard";
import { getTextClass } from "../lib/helpers";

const HoverCard = ({
  item,
  type,
  children,
  showLocation,
  visible,
  setVisible,
  handleClick,
}) => {
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setVisible(true), 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setVisible(false);
  };

  return (
    <Popover
      width={type == "item" ? 240 : 190}
      shadow="lg"
      position="top"
      withArrow
      offset={20}
      radius="md"
      onClose={() => setVisible(false)}
      withinPortal={false}
      opened={visible}
      classNames={{
        dropdown: type === "item" ? "" : getTextClass(item?.color?.hex),
      }}
      styles={{
        dropdown: {
          backgroundColor:
            item?.color?.hex ?? "var(--mantine-color-bluegray-0)",
        },
      }}
    >
      <Popover.Target>
        <div
          ref={hoverTimer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="w-full select-none">{children}</button>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        {type === "item" ? (
          <HoverItem
            item={item}
            showLocation={showLocation}
            handleClick={handleClick}
          />
        ) : (
          <HoverColorCard item={item} type={type} handleClick={handleClick} />
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default HoverCard;
