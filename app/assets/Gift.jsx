import React from "react";

const Gift = ({
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
    viewBox="0 0 20 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M19,7v2c0,.55-.45,1-1,1h-1v7c0,1.1-.9,2-2,2H5c-1.1,0-2-.9-2-2v-7h-1c-.55,0-1-.45-1-1v-2c0-.55.45-1,1-1h16c.55,0,1,.45,1,1Z"
    />
    <rect
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x="1"
      y="6"
      width="18"
      height="4"
      rx="1"
      ry="1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M10,6v13"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3,10v7c0,1.1.9,2,2,2h10c1.1,0,2-.9,2-2v-7"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M14.5,6c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5c-1.97-.03-3.76,1.95-4.5,5-.74-3.05-2.53-5.03-4.5-5-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5"
    />
  </svg>
);

export default Gift;
