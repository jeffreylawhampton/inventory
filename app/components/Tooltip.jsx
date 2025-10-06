import { Tooltip as TooltipComponent } from "@mantine/core";
import { tooltipStyles } from "@/app/lib/styles";

const Tooltip = ({
  label,
  delay = 600,
  position = "right",
  withArrow = false,
  arrowSize = 10,
  textClasses = "!text-black font-medium",
  color = "white",
  children,
  hidden = false,
  zIndex,
}) => {
  return (
    <TooltipComponent
      label={label}
      position={position}
      openDelay={delay}
      radius={tooltipStyles.radius}
      offset={tooltipStyles.offset}
      withArrow={withArrow}
      arrowSize={arrowSize}
      color={color}
      events={{ hover: true, focus: true, touch: true }}
      classNames={{
        tooltip: `${textClasses} ${
          hidden && "hidden"
        } ${zIndex} !px-3 drop-shadow-md`,
      }}
    >
      {children}
    </TooltipComponent>
  );
};

export default Tooltip;
