"use client";
import { Tooltip as NextTooltip } from "@nextui-org/react";

const Tooltip = ({ children, text, placement, radius = "sm", delay = 0 }) => {
  return (
    <NextTooltip
      placement={placement}
      content={text}
      radius={radius}
      delay={delay}
    >
      {children}
    </NextTooltip>
  );
};

export default Tooltip;
