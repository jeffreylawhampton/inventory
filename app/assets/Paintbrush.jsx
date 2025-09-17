import React from "react";

const Paintbrush = ({
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
    viewBox="0 0 22 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M8,7c-1.8,2.71-3.97,3.46-6.58,3.95-.28.05-.46.31-.41.59.02.08.05.16.11.23l7.32,8.88c.31.32.79.41,1.18.2,2.12-1.45,5.38-5.06,5.38-6.85" />
    <path d="M17.38,1.62c.83-.83,2.17-.83,3,0,.83.83.83,2.17,0,3h0l-4.02,4.02c-.2.2-.2.51,0,.71l.94.94c.94.94.94,2.47,0,3.41l-.94.94c-.2.2-.51.2-.71,0L7.35,6.35c-.2-.2-.2-.51,0-.71l.94-.94c.94-.94,2.47-.94,3.41,0l.94.94c.2.2.51.2.71,0l4.02-4.02Z" />
    <path d="M13.62,16.9l-10.68-2.91" />
  </svg>
);

export default Paintbrush;
