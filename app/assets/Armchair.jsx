import React from "react";

const Armchair = ({
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
    viewBox="0 0 20 18"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M19,8v5c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-5c0-1.1.9-2,2-2v-3c0-1.1.9-2,2-2h10c1.1,0,2,.9,2,2v3c1.1,0,2,.9,2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3,6v-3c0-1.1.9-2,2-2h10c1.1,0,2,.9,2,2v3"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,8v5c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-5c0-1.1.9-2,2-2s2,.9,2,2v1.5c0,.28.22.5.5.5h9c.28,0,.5-.22.5-.5v-1.5c0-1.1.9-2,2-2s2,.9,2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3,15v2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M17,15v2"
    />
  </svg>
);

export default Armchair;
