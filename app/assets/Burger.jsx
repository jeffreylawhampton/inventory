import React from "react";

const Burger = ({
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
      d="M19,14h-1c1.1,0,2,.9,2,2,0,1.66-1.34,3-3,3H5c-1.66,0-3-1.34-3-3,0-1.1.9-2,2-2h-1c-1.1,0-2-.9-2-2s.9-2,2-2h1c-1.1,0-2-.9-2-2C2,4.13,6.03,1,11,1s9,3.13,9,7c0,1.1-.9,2-2,2h1c1.1,0,2,.9,2,2s-.9,2-2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M14.75,14h4.25c1.1,0,2-.9,2-2s-.9-2-2-2H3c-1.1,0-2,.9-2,2s.9,2,2,2h8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M4,10c-1.1,0-2-.9-2-2C2,4.13,6.03,1,11,1s9,3.13,9,7c0,1.1-.9,2-2,2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M18,14c1.1,0,2,.9,2,2,0,1.66-1.34,3-3,3H5c-1.66,0-3-1.34-3-3,0-1.1.9-2,2-2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5.67,10l6.13,4.6c.88.66,2.14.48,2.8-.4h0l3.15-4.2"
    />
  </svg>
);

export default Burger;
