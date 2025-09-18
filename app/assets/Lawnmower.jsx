import React from "react";

const Lawnmower = ({
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
    viewBox="0 0 22.78 17.94"
    strokeLinejoin="round"
    strokeLinecap="round"
    {...props}
  >
    <polygon
      fill={fill}
      stroke="none"
      points="20.22 14.74 8.22 14.74 8.51 7.23 19.81 8.97 20.22 14.74"
    />
    <path
      fill={fill}
      stroke="none"
      d="M10.64,14.31c0,1.46-1.17,2.63-2.62,2.63s-2.63-1.17-2.63-2.63,1.18-2.62,2.63-2.62,2.62,1.17,2.62,2.62Z"
    />
    <path
      fill={fill}
      stroke="none"
      d="M21.78,14.73c0,1.22-.98,2.21-2.2,2.21s-2.21-.99-2.21-2.21.99-2.2,2.21-2.2,2.2.99,2.2,2.2Z"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="17.04"
      y1="14.74"
      x2="10.92"
      y2="14.74"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M8.02,10.98v-2.06c0-.66.38-1.24.93-1.52.32-.17.7-.21,1.06-.15l8.07,1.31c.95,0,1.71.77,1.71,1.71v2.25"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M10.64,14.31c0,1.46-1.17,2.63-2.62,2.63s-2.63-1.17-2.63-2.63,1.18-2.62,2.63-2.62,2.62,1.17,2.62,2.62Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21.78,14.73c0,1.22-.98,2.21-2.2,2.21s-2.21-.99-2.21-2.21.99-2.2,2.21-2.2,2.2.99,2.2,2.2Z"
    />
    <polyline
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      points="8.02 7.79 2.65 1 1 2.51"
    />
  </svg>
);

export default Lawnmower;
