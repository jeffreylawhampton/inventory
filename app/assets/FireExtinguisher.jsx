import React from "react";

const FireExtinguisher = ({
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
    viewBox="0 0 15 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M13,9v10c0,1.1-.9,2-2,2h-4c-1.1,0-2-.9-2-2v-10c0-1.04.4-1.99,1.05-2.7v-3.48c.31-.09.63-.14.95-.14,0-.92.45-1.68,1-1.68h2c.55,0,1,.76,1,1.68h.56v3.25c.88.73,1.44,1.84,1.44,3.07Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M7,5.5v-3.5c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v3.5"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5,17h8"
    />
    <polyline
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      points="11 2 11.56 2 14 2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,19v-11c0-1.77.77-3.37,2-4.46.84-.76,1.89-1.28,3.05-1.46.31-.05.63-.08.95-.08"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,12h4"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13,9v10c0,1.1-.9,2-2,2h-4c-1.1,0-2-.9-2-2v-10c0-2.21,1.79-4,4-4s4,1.79,4,4Z"
    />
  </svg>
);

export default FireExtinguisher;
