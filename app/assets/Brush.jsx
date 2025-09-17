import React from "react";

const Brush = ({
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
    viewBox="0 0 22 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M8.97,16.03l11.41-11.41c.83-.83.83-2.17,0-3-.83-.83-2.17-.83-3,0h0L5.97,13.03" />
    <path d="M10,9l3,3" />
    <path d="M5.5,20c1.93,0,3.5-1.57,3.5-3.5s-1.57-3.5-3.5-3.5-3.5,1.57-3.5,3.5c0,.67-.25,1.31-.71,1.79-.39.39-.39,1.02,0,1.41.19.19.44.29.71.29h3.5Z" />
  </svg>
);

export default Brush;
