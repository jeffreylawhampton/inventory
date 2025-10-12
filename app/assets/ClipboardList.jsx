import React from "react";

const ClipboardList = ({
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
    viewBox="0 0 18 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M13,3h2c1.1,0,2,.9,2,2v14c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h2" />
    <rect x="5" y="1" width="8" height="4" rx="1" ry="1" />
    <path d="M9,10h4" />
    <path d="M9,15h4" />
    <path d="M5,10h.01" />
    <path d="M5,15h.01" />
  </svg>
);

export default ClipboardList;
