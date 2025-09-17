import React from "react";

const Horse = ({
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
    viewBox="0 0 23 19"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      fill={fill}
      d="M6.32,7.37l-.9,8.96c-.08.79.49,1.49,1.28,1.56.05,0,.1,0,.14,0h.15c.86,0,1.64-.52,1.96-1.32l1.05-2.62c.32-.8,1.09-1.32,1.96-1.32h1.36c.86,0,1.64.52,1.96,1.32l1.05,2.62c.32.8,1.09,1.32,1.96,1.32h.15c.8,0,1.44-.65,1.44-1.44,0-.04,0-.09,0-.13l-.91-10.01h-8.42c0-3.16-3.16-5.26-6.32-5.26L1.05,7.37l2.11,2.11s3.16-2.11,3.16-2.11Z"
    />
    <path fill="none" d="M22.11,11.58v-2.11c0-1.74-1.41-3.16-3.16-3.16" />
  </svg>
);

export default Horse;
