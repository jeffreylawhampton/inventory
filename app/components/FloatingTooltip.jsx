import { Tooltip } from "@mantine/core";
import { tooltipStyles } from "../lib/styles";

const FloatingTooltip = ({
  label,
  delay = 4000,
  position = "right",
  withArrow = false,
  arrowSize = 10,
  textClasses = "!text-black font-medium",
  color = "white",
  offset = 10,
  children,
}) => {
  return (
    <Tooltip.Floating
      label={label}
      position={position}
      openDelay={delay}
      radius={tooltipStyles.radius}
      offset={offset}
      withArrow={withArrow}
      arrowSize={arrowSize}
      color={color}
      classNames={{
        tooltip: `${textClasses} !px-3 drop-shadow-md`,
      }}
    >
      {children}
    </Tooltip.Floating>
  );
};

export default FloatingTooltip;
