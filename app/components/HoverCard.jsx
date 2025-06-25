import { useState, useRef } from "react";
import { useLongPress } from "../hooks/useLongPress";
import { Popover } from "@mantine/core";
import HoverItem from "./HoverItem";
import HoverColorCard from "./HoverColorCard";
import { getTextClass } from "../lib/helpers";
import { handlePreventLongPress } from "../items/handlers";

const HoverCard = ({ item, type, children, showLocation }) => {
  const [visible, setVisible] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setVisible(true), 700);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setVisible(false);
  };

  const longPressProps = useLongPress(
    () => setVisible(true),
    600,
    () => setVisible(false)
  );

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
          onContextMenu={handlePreventLongPress}
        >
          <button
            onContextMenu={handlePreventLongPress}
            {...longPressProps}
            className="w-full"
          >
            {children}
          </button>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        {type === "item" ? (
          <HoverItem item={item} showLocation={showLocation} />
        ) : (
          <HoverColorCard item={item} type={type} />
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default HoverCard;
