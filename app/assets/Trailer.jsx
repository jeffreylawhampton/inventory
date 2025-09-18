import React from "react";

const Trailer = ({
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
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      fill={fill}
      d="M17,15V5c0-2.21-1.79-4-4-4H5C2.79,1,1,2.79,1,5v8c0,1.1.9,2,2,2h2"
    />
    <path fill={fill} d="M1,5h3c.55,0,1,.45,1,1v2c0,.55-.45,1-1,1H1" />
    <path
      fill="none"
      d="M21,13v1c0,.55-.45,1-1,1h-11V6c0-.55.45-1,1-1h2c.55,0,1,.45,1,1v9"
    />
    <circle fill={fill} cx="7" cy="15" r="2" />
  </svg>
);

export default Trailer;
