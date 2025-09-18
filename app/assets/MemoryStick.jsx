import React from "react";

const MemoryStick = ({
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
    viewBox="0 0 22 16"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    fill={fill}
    {...props}
  >
    <path d="M1,3c0-1.1.9-2,2-2h16c1.1,0,2,.9,2,2v1.1c-1.06.31-1.67,1.42-1.35,2.48.19.65.7,1.16,1.35,1.35v5.06c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-5.1c1.06-.31,1.67-1.42,1.35-2.48-.19-.65-.7-1.16-1.35-1.35v-1.06Z" />
    <path d="M5,15v-3" />
    <path d="M9,15v-3" />
    <path d="M13,15v-3" />
    <path d="M17,15v-3" />
    <path d="M7,7v-2" />
    <path d="M15,7v-2" />
    <path d="M11,7v-2" />
    <path d="M1,11h20" />
  </svg>
);

export default MemoryStick;
