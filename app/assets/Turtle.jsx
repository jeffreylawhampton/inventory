import React from "react";

const Turtle = ({
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
    viewBox="0 0 22 14"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M21,7c0,1.1-.9,2-2,2h-2v3c0,.55-.45,1-1,1h-2c-.55,0-1-.45-1-1v-3H5v3c0,.55-.45,1-1,1h-2c-.55,0-1-.45-1-1v-3c0-2.44,1.09-4.63,2.82-6.1,1.39-1.18,3.2-1.9,5.18-1.9s3.79.72,5.18,1.9c.7.59,1.29,1.3,1.75,2.1h3.07c1.1,0,2,.9,2,2Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M17,9v3c0,.55-.45,1-1,1h-2c-.55,0-1-.45-1-1v-3l-2-4h-4l-2,4v3c0,.55-.45,1-1,1h-2c-.55,0-1-.45-1-1v-3c0-2.44,1.09-4.63,2.82-6.1,1.39-1.18,3.2-1.9,5.18-1.9s3.79.72,5.18,1.9c.7.59,1.29,1.3,1.75,2.1.68,1.17,1.07,2.54,1.07,4Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3.82,2.9l3.18,2.1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M14.18,2.9l-3.18,2.1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,9h18c1.1,0,2-.9,2-2s-.9-2-2-2h-3.07"
    />
  </svg>
);

export default Turtle;
