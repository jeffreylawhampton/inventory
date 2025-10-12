import React from "react";

const Dog = ({
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
    viewBox="0 0 21.28 20.05"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    {...props}
  >
    <rect
      stroke="none"
      fill={fill}
      x="4.44"
      y="5.61"
      width="11.75"
      height="4.44"
    />
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill={fill}
      d="M2.93,9.3c-.28,1.08-.42,2.19-.42,3.31,0,4.17,3.58,6.44,8,6.44s8-2.27,8-6.44c0-1.12-.17-2.24-.49-3.31"
    />
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill={fill}
      d="M9.76,14.3h1.5l-.75.75-.75-.75Z"
    />
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill={fill}
      d="M14.51,12.05v.5"
    />
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill={fill}
      d="M6.51,12.05v.5"
    />
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill={fill}
      d="M7.01,6.55c-.38,1.05-1.08,2.03-2.34,2.5-1.93.72-3.58-.3-3.66-1-.11-.99,1.18-6.53,4-7,1.92-.32,3.65.85,3.65,2.23,1.26-.32,2.59-.31,3.85.04,0-1.39,1.84-2.6,3.77-2.28,2.82.47,4.11,6.01,4,7-.08.7-1.73,1.72-3.66,1-1.26-.47-1.85-1.45-2.24-2.5"
    />
  </svg>
);

export default Dog;
