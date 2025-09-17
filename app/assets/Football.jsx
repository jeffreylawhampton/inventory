import React from "react";

const Football = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 1.5,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 23 23"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      fill={fill}
      d="M22.38,4.86v2.14s-.25,1.69-.25,1.69c-1.18,6.81-6.69,12.25-13.52,13.33l-1.78.21c-.68-.04-1.39.03-2.06-.01-1.75-.12-3.37-.46-3.79-2.42-.55-2.58-.09-5.97.83-8.42C4.48,4.28,12.15-.36,19.73.98c2.17.38,2.54,1.93,2.65,3.88Z"
    />
    <line fill="none" x1="8.52" y1="14.54" x2="14.58" y2="8.49" />
    <line fill="none" x1="8.74" y1="12.14" x2="10.92" y2="14.33" />
    <line fill="none" x1="10.62" y1="10.25" x2="12.8" y2="12.44" />
    <line fill="none" x1="12.59" y1="8.29" x2="14.77" y2="10.48" />
    <line fill="none" x1="1.09" y1="13.97" x2="9.05" y2="21.95" />
    <line fill="none" x1="14.23" y1="1.22" x2="21.87" y2="8.88" />
  </svg>
);

export default Football;
