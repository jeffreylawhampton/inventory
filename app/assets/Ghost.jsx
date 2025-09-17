import React from "react";

const Ghost = ({
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
    viewBox="0 0 18 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M9,1C4.58,1,1,4.58,1,9v12l3-3,2.5,2.5,2.5-2.5,2.5,2.5,2.5-2.5,3,3v-12c0-4.42-3.58-8-8-8Z" />
    <path d="M6,9h.01" />
    <path d="M12,9h.01" />{" "}
  </svg>
);

export default Ghost;
