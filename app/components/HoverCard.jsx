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
    <div
      ref={hoverTimer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Popover
        width={type == "item" ? 240 : 190}
        shadow="lg"
        position="top"
        withArrow
        arrowSize={10}
        offset={0}
        radius="md"
        onClose={() => setVisible(false)}
        withinPortal={false}
        opened={visible}
        classNames={{
          arrow: type === "item" ? "!border-[3px] !border-primary-600" : "",
          dropdown: `flex flex-col justify-center min-h-[60px] ${
            type === "item"
              ? "!border-[3px] !border-primary-600"
              : getTextClass(item?.color?.hex)
          }`,
        }}
        styles={{
          dropdown: {
            backgroundColor:
              item?.color?.hex ?? "var(--mantine-color-bluegray-0)",
          },
        }}
      >
        <Popover.Target>
          <button className="w-full select-none">{children}</button>
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
    </div>
  );
};

export default HoverCard;
