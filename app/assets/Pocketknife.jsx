import React from "react";

const Pocketknife = ({
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
      d="M21,5v12c0,2.21-1.79,4-4,4v-10.34l-9.17,9.17c-1.56,1.56-4.1,1.56-5.66,0s-1.56-4.1,0-5.66L14.17,2.17c1.56-1.56,4.1-1.56,5.66,0,.78.78,1.17,1.81,1.17,2.83Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M2,1v1c0,1,2,1,2,2s-2,1-2,2,2,1,2,2-2,1-2,2,2,1,2,2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M17,5h.01"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5,17h.01"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,5c0,1.02-.39,2.05-1.17,2.83l-2.83,2.83-9.17,9.17c-1.56,1.56-4.1,1.56-5.66,0s-1.56-4.1,0-5.66L14.17,2.17c1.56-1.56,4.1-1.56,5.66,0,.78.78,1.17,1.81,1.17,2.83Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,5v12c0,2.21-1.79,4-4,4v-10.34"
    />
  </svg>
);

export default Pocketknife;
