import React from "react";

const BriefcaseBusiness = ({
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
    <rect
      fill={fill}
      stroke="none"
      x="1"
      y="5"
      width="20"
      height="14"
      rx="2"
      ry="2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,11h.01"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M7,5v-2c0-1.1.9-2,2-2h4c1.1,0,2,.9,2,2v2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,12c-6.07,4-13.93,4-20,0"
    />
    <rect
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x="1"
      y="5"
      width="20"
      height="14"
      rx="2"
      ry="2"
    />
  </svg>
);

export default BriefcaseBusiness;
