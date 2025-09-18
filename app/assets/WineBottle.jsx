import React from "react";

const WineBottle = ({
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
    viewBox="0 0 12 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M11,12v8c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-8c0-1.3.42-2.56,1.2-3.6l.6-.8c.78-1.04,1.2-2.3,1.2-3.6v-2c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v2c0,1.3.42,2.56,1.2,3.6l.6.8c.78,1.04,1.2,2.3,1.2,3.6Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,12v8c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-8c0-1.3.42-2.56,1.2-3.6l.6-.8c.78-1.04,1.2-2.3,1.2-3.6v-2c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v2c0,1.3.42,2.56,1.2,3.6l.6.8c.78,1.04,1.2,2.3,1.2,3.6Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,12h-4c-.55,0-1,.45-1,1v3c0,.55.45,1,1,1h4"
    />
  </svg>
);

export default WineBottle;
