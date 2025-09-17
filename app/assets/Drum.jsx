import React from "react";

const Drum = ({
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
    viewBox="0 0 22 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M21,8v8c0,2.76-4.48,5-10,5S1,18.76,1,16v-8c0-1.47,1.27-2.8,3.3-3.7,1.77-.81,4.12-1.3,6.7-1.3s4.93.49,6.7,1.3c2.03.9,3.3,2.23,3.3,3.7Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,1l8,8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,1l-8,8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,8c0,2.76-4.48,5-10,5S1,10.76,1,8c0-1.47,1.27-2.8,3.3-3.7,1.77-.81,4.12-1.3,6.7-1.3s4.93.49,6.7,1.3c2.03.9,3.3,2.23,3.3,3.7Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M6,12.4v7.9"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,13v8"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M16,12.4v7.9"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,8v8c0,2.76-4.48,5-10,5S1,18.76,1,16v-8"
    />
  </svg>
);

export default Drum;
