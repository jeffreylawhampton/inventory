import React from "react";

const MapPin = ({
  size = 18,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 2,
  secondaryFill = "#ff4612",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 15.75 19.24"
    stroke={stroke ?? color}
    fill={fill}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7.87.87C4.01.87.87,4,.87,7.86c0,4.37,4.85,8.92,6.48,10.33.31.23.73.23,1.05,0,1.63-1.41,6.48-5.96,6.48-10.33,0-3.86-3.14-6.99-7-6.99ZM7.87,10.49c-1.45,0-2.62-1.18-2.62-2.62s1.18-2.62,2.62-2.62,2.62,1.18,2.62,2.62-1.18,2.62-2.62,2.62Z" />
  </svg>
);

export default MapPin;
