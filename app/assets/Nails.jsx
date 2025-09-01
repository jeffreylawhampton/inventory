import React from "react";

const Nails = ({
  size = 20,
  color = "currentColor",
  fill = "none",
  stroke,
  strokeWidth = 1,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 18.51 18.87"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3.9,2v14.63s-.98,1.82-.98,1.82l-1.02-1.82V2h2.01ZM5.42,1.48V.38s-5.04,0-5.04,0v1.1c0,.29.24.53.53.53h3.98c.29,0,.53-.24.53-.53Z" />
    <path d="M10.26,4.05v11.63s-.98,1.82-.98,1.82l-1.02-1.82V4.05h2.01ZM11.78,3.52v-1.1s-5.04,0-5.04,0v1.1c0,.29.24.53.53.53h3.98c.29,0,.53-.24.53-.53Z" />
    <path d="M16.62,2.05v14.63s-.98,1.82-.98,1.82l-1.02-1.82V2.05h2.01ZM18.14,1.52V.42s-5.04,0-5.04,0v1.1c0,.29.24.53.53.53h3.98c.29,0,.53-.24.53-.53Z" />
  </svg>
);

export default Nails;
