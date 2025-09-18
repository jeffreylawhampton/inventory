import React from "react";

const Mail = ({
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
    viewBox="0 0 22 18"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <rect x="1" y="1" width="20" height="16" rx="2" ry="2" />
    <path d="M21,4l-8.99,5.73c-.62.36-1.39.36-2.01,0L1,4" />
  </svg>
);

export default Mail;
