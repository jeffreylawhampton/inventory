import React from "react";

const Cable = ({
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
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      fill={fill}
      d="M16,17c-.55,0-1-.45-1-1v-2c0-1.1.9-2,2-2h2c1.1,0,2,.9,2,2v2c0,.55-.45,1-1,1h-4Z"
    />
    <path fill="none" d="M16,19v-2" />
    <path
      fill="none"
      d="M18,12v-7.5c0-1.93-1.57-3.5-3.5-3.5s-3.5,1.57-3.5,3.5v11c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5v-7.5"
    />
    <path fill="none" d="M20,19v-2" />
    <path fill="none" d="M2,3V1" />
    <path
      fill={fill}
      d="M3,8c-1.1,0-2-.9-2-2v-2c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v2c0,1.1-.9,2-2,2h-2Z"
    />
    <path fill="none" d="M6,3V1" />
  </svg>
);

export default Cable;
