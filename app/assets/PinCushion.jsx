import React from "react";

const PinCushion = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 1.5,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1.63,15.74c0-3.96,3.72-7.18,8.3-7.18s8.3,3.21,8.3,7.18" />
    <rect x=".36" y="15.94" width="19.14" height="3.38" rx=".78" ry=".78" />
    <path d="M4.98,4.53c.44.83.1,1.86-.75,2.29s-1.89.11-2.33-.72-.1-1.87.74-2.3,1.89-.11,2.33.73Z" />
    <path d="M11.47,1.28c.44.83.1,1.86-.75,2.29s-1.89.11-2.33-.72-.1-1.87.74-2.3,1.89-.11,2.33.73Z" />
    <line x1="9.93" y1="3.93" x2="9.93" y2="8.4" />
    <line x1="4.27" y1="6.9" x2="6.72" y2="11.57" />
    <path d="M17.99,6.89c-.48.81-1.55,1.07-2.37.59s-1.1-1.52-.61-2.33,1.55-1.08,2.37-.6,1.1,1.52.61,2.34Z" />
    <line x1="15.58" y1="7.56" x2="12.86" y2="12.08" />
  </svg>
);

export default PinCushion;
