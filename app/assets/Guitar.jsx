import React from "react";

const Guitar = ({
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
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    fill={fill}
    {...props}
  >
    <path d="M7.23,8.84c.46-1.12,1.56-1.85,2.77-1.85,2.76,0,5,2.24,5,5,0,1.21-.73,2.31-1.85,2.77l-.92.38c-.75.31-1.23,1.04-1.23,1.85,0,2.21-1.79,4-4,4-3.31,0-6-2.69-6-6,0-2.21,1.79-4,4-4,.81,0,1.54-.48,1.85-1.23l.38-.92Z" />
    <path d="M10.9,11.09l4.51-4.51" />
    <path d="M19.1,1.29c-.39-.38-1.01-.38-1.4,0l-1.11,1.11c-.38.37-.59.88-.59,1.41v1.34c0,.53-.21,1.04-.59,1.41.37-.38.88-.59,1.41-.59h1.34c.53,0,1.04-.21,1.41-.59l1.11-1.11c.38-.39.38-1.01,0-1.4l-1.6-1.6Z" />
    <path d="M5,14.99l2,2" />
  </svg>
);

export default Guitar;
