import React from "react";

const Keyboard = ({
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
    viewBox="0 0 22 18"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <rect x="1" y="1" width="20" height="16" rx="2" ry="2" />
    <path d="M9,5h.01" />
    <path d="M11,9h.01" />
    <path d="M13,5h.01" />
    <path d="M15,9h.01" />
    <path d="M17,5h.01" />
    <path d="M5,5h.01" />
    <path d="M6,13h10" />
    <path d="M7,9h.01" />
  </svg>
);

export default Keyboard;
