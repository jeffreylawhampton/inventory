import React from "react";

const House = ({
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
    viewBox="0 0 20 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M19,9v9c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-9c0-.59.26-1.15.71-1.53L8.71,1.47c.74-.63,1.84-.63,2.58,0l7,6c.45.38.71.94.71,1.53Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13,20v-8c0-.55-.45-1-1-1h-4c-.55,0-1,.45-1,1v8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,9v9c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-9c0-.59.26-1.15.71-1.53L8.71,1.47c.74-.63,1.84-.63,2.58,0l7,6c.45.38.71.94.71,1.53Z"
    />
  </svg>
);

export default House;
