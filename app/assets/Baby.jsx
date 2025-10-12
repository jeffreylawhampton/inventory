import React from "react";

const Baby = ({
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
    viewBox="0 0 21.86 19.92"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M18.31,4.81c.7,1.02,1.18,2.17,1.42,3.39.99.48,1.41,1.68.93,2.67-.2.41-.52.73-.93.93-1.04,4.86-5.83,7.96-10.69,6.91-3.46-.74-6.17-3.45-6.91-6.91-.99-.48-1.41-1.68-.93-2.67.2-.41.52-.73.93-.93C2.98,4.02,6.66,1.01,10.93,1c2,0,3.5,1.1,3.5,2.5s-.9,2.5-2,2.5c-.8,0-1.5-.4-1.5-1" />
    <path d="M8.93,14c.5.3,1.2.5,2,.5s1.5-.2,2-.5" />
    <path d="M13.93,10h.01" />
    <path d="M7.93,10h.01" />
  </svg>
);

export default Baby;
