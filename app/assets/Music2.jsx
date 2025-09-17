import React from "react";

const Music2 = ({
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
    viewBox="0 0 17 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <circle fill={fill} cx="5" cy="17" r="4" />
    <path fill="none" d="M9,17V1l7,4" />
  </svg>
);

export default Music2;
