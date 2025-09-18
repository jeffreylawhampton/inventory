import React from "react";

const Microscope = ({
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
    viewBox="0 0 20 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path fill="none" d="M4,17h8" />
    <path fill="none" d="M1,21h18" />
    <path fill="none" d="M12,21c3.87,0,7-3.13,7-7s-3.13-7-7-7h-1" />
    <path fill="none" d="M7,13h2" />
    <path fill={fill} d="M10,5v-3c0-.55-.45-1-1-1h-2c-.55,0-1,.45-1,1v3" />
    <path fill={fill} d="M7,11c-1.1,0-2-.9-2-2v-4h6v4c0,1.1-.9,2-2,2h-2Z" />
  </svg>
);

export default Microscope;
