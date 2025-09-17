import React from "react";

const SoccerBall = ({
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
    viewBox="0 0 22.5 22.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      fill={fill}
      d="M1,11.24c0,5.65,4.58,10.24,10.24,10.24s10.24-4.58,10.24-10.24S16.89,1,11.24,1,1,5.58,1,11.24"
    />
    <path
      fill="none"
      d="M11.24,5.55l5.41,3.92-2,6.31h-6.83l-2-6.31,5.41-3.92Z"
    />
    <path
      fill="none"
      d="M11.24,5.55V1M14.65,15.79l2.84,3.41M16.65,9.47l4.25-1.65M7.89,15.84l-2.91,3.36M5.82,9.47l-4.25-1.65"
    />
  </svg>
);

export default SoccerBall;
