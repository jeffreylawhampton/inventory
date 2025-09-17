import React from "react";

const Stethoscope = ({
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
    viewBox="0 0 22 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path fill="none" d="M10,1v2" />
    <path fill="none" d="M4,1v2" />
    <path
      fill="none"
      d="M4,2h-1c-1.1,0-2,.9-2,2v4c0,3.31,2.69,6,6,6s6-2.69,6-6v-4c0-1.1-.9-2-2-2h-1"
    />
    <path fill="none" d="M7,14c0,3.31,2.69,6,6,6s6-2.69,6-6v-3" />
    <circle fill={fill} cx="19" cy="9" r="2" />
  </svg>
);

export default Stethoscope;
