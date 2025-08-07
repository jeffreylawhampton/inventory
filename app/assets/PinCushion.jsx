import React from "react";

const PinCushion = ({
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
    viewBox="0 0 20 20"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1.85,15.73c0-3.92,3.63-7.1,8.11-7.1s8.11,3.18,8.11,7.1" />
    <rect x=".61" y="15.93" width="18.7" height="3.35" rx=".78" ry=".78" />
    <path d="M5.12,4.63c.43.83.1,1.84-.73,2.27s-1.85.11-2.27-.72-.1-1.85.73-2.28,1.85-.11,2.28.73Z" />
    <path d="M11.46,1.41c.43.83.1,1.84-.73,2.27s-1.85.11-2.27-.72-.1-1.85.73-2.28,1.85-.11,2.28.73Z" />
    <line x1="9.96" y1="4.03" x2="9.96" y2="8.46" />
    <line x1="4.43" y1="6.98" x2="6.82" y2="11.6" />
    <path d="M17.83,6.96c-.47.8-1.51,1.06-2.31.58s-1.07-1.51-.6-2.31,1.52-1.07,2.32-.59,1.07,1.51.59,2.32Z" />
    <line x1="15.47" y1="7.62" x2="12.82" y2="12.1" />
  </svg>
);

export default PinCushion;
