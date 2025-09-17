import React from "react";

const PaintRoller = ({
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
    viewBox="0 0 22 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <rect fill={fill} x="1" y="1" width="16" height="6" rx="2" ry="2" />
    <path
      fill="none"
      d="M9,15v-2c0-1.1.9-2,2-2h8c1.1,0,2-.9,2-2v-3c0-1.1-.9-2-2-2h-2"
    />
    <rect fill={fill} x="7" y="15" width="4" height="6" rx="1" ry="1" />
  </svg>
);

export default PaintRoller;
