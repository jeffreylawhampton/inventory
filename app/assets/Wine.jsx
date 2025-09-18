import React from "react";

const Wine = ({
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
    viewBox="-3 0 20 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path fill={fill} stroke="none" d="M11,9c0,2.76-2.24,5-5,5S1,11.76,1,9" />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M2,21h8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,9H1M9,1H3C1.5,5,1,7,1,9c0,2.76,2.24,5,5,5s5-2.24,5-5c0-2-.5-4-2-8Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M6,14v7"
    />
  </svg>
);

export default Wine;
