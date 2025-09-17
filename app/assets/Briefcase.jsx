import React from "react";

const Briefcase = ({
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
      d="M15,19V3c0-1.1-.9-2-2-2h-4c-1.1,0-2,.9-2,2v16"
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

export default Briefcase;
