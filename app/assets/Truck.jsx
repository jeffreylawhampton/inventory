import React from "react";

const Truck = ({
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
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M21,10.35v3.65c0,.55-.45,1-1,1h-2c0,1.1-.9,2-2,2s-2-.9-2-2h-6c0,1.1-.9,2-2,2s-2-.9-2-2h-2c-.55,0-1-.45-1-1V3c0-1.1.9-2,2-2h8c1.1,0,2,.9,2,2v2h3.52c.3,0,.59.14.78.38l3.48,4.35c.14.17.22.39.22.62Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M4,15h-2c-.55,0-1-.45-1-1V3c0-1.1.9-2,2-2h8c1.1,0,2,.9,2,2v12"
    />
    <polyline
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      points="8 15 13 15 14 15"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13,5h3.52c.3,0,.59.14.78.38l3.48,4.35c.14.17.22.39.22.62v3.65c0,.55-.45,1-1,1h-2"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="16"
      cy="15"
      r="2"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="6"
      cy="15"
      r="2"
    />
  </svg>
);

export default Truck;
