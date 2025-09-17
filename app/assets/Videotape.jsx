import React from "react";

const Spool = ({
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
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19,1H3c-1.1,0-2,.9-2,2v12c0,1.1.9,2,2,2h16c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM7,13c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2ZM15,13c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Z" />
    <path d="M19,1H3c-1.1,0-2,.9-2,2v12c0,1.1.9,2,2,2h16c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM7,13c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2ZM15,13c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Z" />
    <path d="M1,5h20" />
    <path d="M7,9h8" />
  </svg>
);

export default Spool;
