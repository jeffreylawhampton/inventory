import React from "react";

const Chess = ({
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
    viewBox="0 0 14 19"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    fill={fill}
    {...props}
  >
    <path d="M7,1c1.66,0,3,1.34,3,3,0,1.11-.6,2.48-1.5,3l1.5,7h-6l1.5-7c-.9-.52-1.5-1.89-1.5-3,0-1.66,1.34-3,3-3Z" />
    <path d="M3,7h8" />
    <path d="M1.68,14.77c-.41.14-.68.52-.68.95v1.28c0,.55.45,1,1,1h10c.55,0,1-.45,1-1v-1.28c0-.43-.28-.81-.68-.95l-2.32-.77h-6s-2.32.77-2.32.77Z" />
  </svg>
);

export default Chess;
