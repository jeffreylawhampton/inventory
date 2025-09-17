import React from "react";

const ChessQueen = ({
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
    viewBox="0 0 16 19"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    fill={fill}
    {...props}
  >
    <path d="M12,14l2-11-4,4-2-5-2,5L2,3l2,11" />
    <path d="M4,14l-1.45.72c-.34.17-.55.52-.55.89v2.38h12v-2.38c0-.38-.21-.72-.55-.89l-1.45-.72s-8,0-8,0Z" />
    <path d="M7,2c0,.55.45,1,1,1s1-.45,1-1-.45-1-1-1-1,.45-1,1" />
    <path d="M1,3c0,.55.45,1,1,1s1-.45,1-1-.45-1-1-1-1,.45-1,1" />
    <path d="M13,3c0,.55.45,1,1,1s1-.45,1-1-.45-1-1-1-1,.45-1,1" />
  </svg>
);

export default ChessQueen;
