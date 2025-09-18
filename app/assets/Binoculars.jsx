import React from "react";

const Binoculars = ({
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
    viewBox="0 0 22 20"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M9,6v11c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-3.85c0-1.39,2-2.96,2-4.83v-2.32c0-.55.45-1,1-1v-3c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v3c.55,0,1,.45,1,1Z"
    />
    <path
      fill={fill}
      stroke="none"
      d="M21,13.15v3.85c0,1.1-.9,2-2,2h-4c-1.1,0-2-.9-2-2V6c0-.55.45-1,1-1v-3c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v3c.55,0,1,.45,1,1v2.32c0,1.87,2,3.44,2,4.83Z"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="13"
      y1="8"
      x2="9"
      y2="8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M14,5v-3c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v3"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,13.15v3.85c0,1.1-.9,2-2,2h-4c-1.1,0-2-.9-2-2V6c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v2.32c0,1.87,2,3.44,2,4.83Z"
    />
    <polyline
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      points="21 14 13 14 9 14 1 14"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M9,6v11c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-3.85c0-1.39,2-2.96,2-4.83v-2.32c0-.55.45-1,1-1h4c.55,0,1,.45,1,1Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M4,5v-3c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v3"
    />
  </svg>
);

export default Binoculars;
