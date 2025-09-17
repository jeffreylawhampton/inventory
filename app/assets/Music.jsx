import React from "react";

const Music = ({
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
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle fill={fill} stroke="none" cx="4" cy="16" r="3" />
    <circle fill={fill} stroke="none" cx="16" cy="14" r="3" />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M7,16V3l12-2v13"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="4"
      cy="16"
      r="3"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="16"
      cy="14"
      r="3"
    />
  </svg>
);

export default Music;
