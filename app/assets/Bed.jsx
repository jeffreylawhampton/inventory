import React from "react";

const Bed = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 1.5,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 18.94 15.5"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M18.08,6.03v6.02H.86v-7.74h15.5c.95,0,1.72.77,1.72,1.72Z"
    />
    <polyline fill="none" points=".86 14.64 .86 12.05 .86 4.31 .86 .86" />
    <path fill="none" d="M18.08,14.64V6.03c0-.95-.77-1.72-1.72-1.72H.86" />
    <polyline fill="none" points="18.08 12.05 4.3 12.05 .86 12.05" />
    <path fill="none" d="M4.31,4.31v7.75" />
  </svg>
);

export default Bed;
