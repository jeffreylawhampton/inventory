import React from "react";

const Umbrella = ({
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
      d="M21,11.01c0,.55-.46.99-1.01.99H2c-.09,0-.18-.01-.27-.04-.53-.15-.84-.7-.69-1.23.93-3.64,3.77-6.48,7.41-7.41.86-.22,1.71-.32,2.55-.32,4.59-.01,8.77,3.08,9.96,7.73.03.09.04.18.04.28Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,12v7c0,1.1.9,2,2,2s2-.9,2-2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,1v2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,11.01c0,.55-.46.99-1.01.99H2c-.09,0-.18-.01-.27-.04-.53-.15-.84-.7-.69-1.23.93-3.64,3.77-6.48,7.41-7.41.86-.22,1.71-.32,2.55-.32,4.59-.01,8.77,3.08,9.96,7.73.03.09.04.18.04.28Z"
    />
  </svg>
);

export default Umbrella;
