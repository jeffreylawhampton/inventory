import React from "react";

const Mic = ({
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
    viewBox="0 0 16 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path fill={fill} d="M8,18v3" />
    <path fill="none" d="M15,9v2c0,3.87-3.13,7-7,7S1,14.87,1,11v-2" />
    <path
      fill={fill}
      d="M8,1h0c1.66,0,3,1.34,3,3v7c0,1.66-1.34,3-3,3h0c-1.66,0-3-1.34-3-3v-7c0-1.66,1.34-3,3-3Z"
    />
  </svg>
);

export default Mic;
