import React from "react";

const Fuel = ({
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
      d="M13,3v16H2V3c0-1.1.9-2,2-2h7c1.1,0,2,.9,2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13,11h2c1.1,0,2,.9,2,2v2c0,1.1.9,2,2,2s2-.9,2-2v-7c0-.53-.21-1.04-.59-1.42l-3.41-3.58"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M2,19V3c0-1.1.9-2,2-2h7c1.1,0,2,.9,2,2v16"
    />
    <polyline
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      points="14 19 13 19 2 19 1 19"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M2,7h11"
    />
  </svg>
);

export default Fuel;
