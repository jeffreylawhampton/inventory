import React from "react";

const GlassWater = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke = "black",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="-2 0 21 21"
    strokeLinejoin="round"
    strokeLinecap="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M13.91,10.23l-.83,7.98c-.11,1.02-.97,1.79-1.99,1.79h-6.4c-1.03.01-1.89-.77-2-1.79l-.91-8.7,12.13.72Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M14.78,2s0,.07-.01.11l-.59,5.58-1.1,10.52c-.11,1.02-.97,1.79-1.99,1.79h-6.4c-1.03.01-1.89-.77-2-1.79L1.59,7.69l-.58-5.59c-.06-.55.34-1.04.89-1.09.03-.01.07-.01.1-.01h11.78c.55,0,1,.45,1,1Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1.89,10c1.78-1.33,4.22-1.33,6,0s4.22,1.33,6,0"
    />
  </svg>
);

export default GlassWater;
