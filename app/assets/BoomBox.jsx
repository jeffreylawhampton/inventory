import React from "react";

const BoomBox = ({
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
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    viewBox="0 0 22.92 20.83"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill="none"
      d="M3.12,7.29V3.12c0-1.15.93-2.08,2.08-2.08h12.5c1.15,0,2.08.93,2.08,2.08v4.17"
    />
    <path fill={fill} d="M7.29,6.25v1.04" />
    <path fill={fill} d="M11.46,6.25v1.04" />
    <path fill={fill} d="M15.62,6.25v1.04" />
    <rect
      fill={fill}
      x="1.04"
      y="7.29"
      width="20.83"
      height="12.5"
      rx="2.08"
      ry="2.08"
    />
    <circle fill={fill} cx="7.29" cy="13.54" r="2.08" />
    <circle fill={fill} cx="15.62" cy="13.54" r="2.08" />
  </svg>
);

export default BoomBox;
