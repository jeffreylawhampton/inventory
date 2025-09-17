import React from "react";

const Gamepad = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 2,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 22 14"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <rect x="1" y="1" width="20" height="12" rx="2" ry="2" />
    <line x1="5" y1="7" x2="9" y2="7" />
    <line x1="7" y1="5" x2="7" y2="9" />
    <line x1="14" y1="8" x2="14.01" y2="8" />
    <line x1="17" y1="6" x2="17.01" y2="6" />
  </svg>
);

export default Gamepad;
