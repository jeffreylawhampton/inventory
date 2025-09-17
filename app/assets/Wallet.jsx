import React from "react";

const Wallet = ({
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
    viewBox="0 0 21 20"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M20,11v2c0,.55-.45,1-1,1v4c0,.55-.45,1-1,1H3c-1.1,0-2-.9-2-2V3c0-1.1.9-2,2-2h13c.55,0,1,.45,1,1v3h1c.55,0,1,.45,1,1v4c.55,0,1,.45,1,1Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,10c.55,0,1,.45,1,1v2c0,.55-.45,1-1,1h-3c-1.1,0-2-.9-2-2s.9-2,2-2h3v-4c0-.55-.45-1-1-1h-1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M1,3c0,1.1.9,2,2,2h14v-3c0-.55-.45-1-1-1H3c-1.1,0-2,.9-2,2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,14v4c0,.55-.45,1-1,1H3c-1.1,0-2-.9-2-2V3"
    />
  </svg>
);

export default Wallet;
