import React from "react";

const Turntable = ({
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
    <path d="M9,9.01h.01" />
    <path d="M17,5v4c0,1.4-.37,2.78-1.07,4" />
    <circle cx="9" cy="9" r="4" />
  </svg>
);

export default Turntable;
