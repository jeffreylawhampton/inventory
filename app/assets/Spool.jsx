import React from "react";

export const Spool = ({
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
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15,11.44l-12.56,3.64c-1.06.31-1.66,1.43-1.35,2.48.25.84,1.02,1.42,1.89,1.43h14.02c1.1,0,2-.89,2-2,0-.89-.59-1.67-1.44-1.92l-1.11-.32c-.86-.25-1.44-1.03-1.44-1.92v-7.18" />
    <path d="M5,8.56l12.56-3.64c1.06-.31,1.66-1.43,1.35-2.48-.25-.84-1.02-1.42-1.89-1.43H3c-1.1,0-2,.89-2,2,0,.89.59,1.67,1.44,1.92l1.12.32c.86.25,1.44,1.03,1.44,1.92v7.18" />
  </svg>
);
