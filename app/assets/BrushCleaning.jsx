import React from "react";

const BrushCleaning = ({
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
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M17,12.99c.55,0,1-.45,1-1v-.99c0-1.1-.9-2-2-2h-3c-.55,0-1-.45-1-1V3c0-1.1-.9-2-2-2s-2,.9-2,2v5c0,.55-.45,1-1,1h-3c-1.1,0-2,.9-2,2v.99c0,.55.45,1,1,1" />
    <path d="M3,13h14l1.97,6.77c.13.54-.2,1.08-.74,1.21-.08.02-.15.03-.23.03H2c-.55,0-1-.45-1-1,0-.08,0-.16.03-.23l1.97-6.77Z" />
    <path d="M14,21l-1-4" />
    <path d="M6,21l1-4" />
  </svg>
);

export default BrushCleaning;
