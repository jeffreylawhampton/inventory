import React from "react";

const Luggage = ({
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
    viewBox="0 0 18 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M17,7v10c0,1.1-.9,2-2,2,0,1.1-.9,2-2,2s-2-.9-2-2h-4c0,1.1-.9,2-2,2s-2-.9-2-2c-1.1,0-2-.9-2-2V7c0-1.1.9-2,2-2h12c1.1,0,2,.9,2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3,19c-1.1,0-2-.9-2-2V7c0-1.1.9-2,2-2h12c1.1,0,2,.9,2,2v10c0,1.1-.9,2-2,2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5,17V3c0-1.1.9-2,2-2h4c1.1,0,2,.9,2,2v14"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="11"
      y1="19"
      x2="7"
      y2="19"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="13"
      cy="19"
      r="2"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="5"
      cy="19"
      r="2"
    />
  </svg>
);

export default Luggage;
