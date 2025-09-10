import { useRef } from "react";
import { Popover } from "@mantine/core";
import { HoverColorCard, HoverItem } from "..";
import { getTextClass } from "../../lib/helpers";

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
    hoverTimer.current = setTimeout(() => setVisible(true), 750);
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
          arrow: type === "item" ? "!border-[3px] !border-bluegray-400" : "",
          dropdown: `flex flex-col justify-center min-h-[60px]  ${
            type === "item"
              ? "!border-[3px] !border-bluegray-400 max-w-[360px]"
              : getTextClass(item?.color?.hex)
          }`,
        }}
        styles={{
          dropdown: {
            backgroundColor:
              item?.color?.hex ?? "var(--mantine-color-bluegray-0)",
            boxShadow: `2px 1px 8px #00000033`,
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
