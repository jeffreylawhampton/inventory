import React from "react";

const Headphones = ({
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
    viewBox="0 0 20 20"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M6,14v3c0,1.1-.9,2-2,2h-1c-1.1,0-2-.9-2-2v-5h3c1.1,0,2,.9,2,2Z"
    />
    <path
      fill={fill}
      stroke="none"
      d="M19,12v5c0,1.1-.9,2-2,2h-1c-1.1,0-2-.9-2-2v-3c0-1.1.9-2,2-2h3Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,12v5c0,1.1-.9,2-2,2h-1c-1.1,0-2-.9-2-2v-3c0-1.1.9-2,2-2h3v-2c0-4.97-4.03-9-9-9S1,5.03,1,10v7c0,1.1.9,2,2,2h1c1.1,0,2-.9,2-2v-3c0-1.1-.9-2-2-2H1"
    />
  </svg>
);

export default Headphones;
