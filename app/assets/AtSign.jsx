import React from "react";

const AtSign = ({
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
    strokeWidth={strokeWidth}
    viewBox="0 0 22 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle fill={fill} stroke={fill} cx="11" cy="11" r="10" />
    <circle fill="none" stroke={stroke ?? color} cx="11" cy="11" r="4" />
    <path
      fill="none"
      stroke={stroke ?? color}
      d="M15,7v5c0,1.66,1.34,3,3,3s3-1.34,3-3v-1c0-5.52-4.48-10-10-10S1,5.48,1,11s4.48,10,10,10c2.16,0,4.27-.7,6-2"
    />
  </svg>
);

export default AtSign;
