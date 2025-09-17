import React from "react";

const Beer = ({
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
    <path d="M3,7v12c0,1.1.9,2,2,2h8c1.1,0,2-.9,2-2V7" />
    <path d="M15,10h1c1.66,0,3,1.34,3,3s-1.34,3-3,3h-1" />
    <path d="M7,11v6" />
    <path d="M11,11v6" />
    <path d="M12,6.5c-1,0-1.44.5-3,.5s-2-.5-3-.5-1.72.5-2.5.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5c.78,0,1.57.5,2.5.5s1.44-1.5,3-1.5,2,1.5,3,1.5,1.72-.5,2.5-.5c1.38,0,2.5,1.12,2.5,2.5s-1.12,2.5-2.5,2.5c-.78,0-1.5-.5-2.5-.5Z" />
  </svg>
);

export default Beer;
