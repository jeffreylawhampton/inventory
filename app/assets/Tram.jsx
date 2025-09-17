import React from "react";

const Tram = ({
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
    viewBox="0 0 18 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect
      fill={fill}
      stroke={stroke ?? color}
      x="1"
      y="1"
      width="16"
      height="16"
      rx="2"
      ry="2"
    />
    <rect
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x="1"
      y="1"
      width="16"
      height="16"
      rx="2"
      ry="2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,9h16"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M9,1v8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5,17l-2,3"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M15,20l-2-3"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5,13h.01"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13,13h.01"
    />
  </svg>
);

export default Tram;
