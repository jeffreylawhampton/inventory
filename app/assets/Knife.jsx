import React from "react";

const Knife = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 21.03 23.21"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.01,14.84c-1.81,1.98-4.18,3.82-5.9,5.85-.42.5-.91,1.84-1.14,2.01-.73.55-1.92-.78-2.33-1.32-.38-.49-.35-1.01.05-1.49,2-2.4,5.15-5.02,7.43-7.3C12.2,8.51,16.22,4.36,20.39.38c1.01,4.27-.98,9.68-3.76,12.68-1,1.08-2.65,2.8-3.81,3.64-.12.08-.29.25-.44.19-.11-.04-2.02-2.02-2.21-2.21-.64-.62-1.26-1.28-1.9-1.9" />
  </svg>
);

export default Knife;
