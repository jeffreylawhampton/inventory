import React from "react";

const Tent = ({
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
    viewBox="0 0 22 20"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon
      fill={fill}
      stroke="none"
      points="19.5 19 14.5 19 11 13 7.5 19 2.5 19 11 4.43 19.5 19"
    />
    <polyline
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill="none"
      points="13 1 11 4.43 2.5 19"
    />
    <polyline
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill="none"
      points="9 1 11 4.43 19.5 19"
    />
    <polyline
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill="none"
      points="7.5 19 11 13 14.5 19"
    />
    <polyline
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      fill="none"
      points="1 19 2.5 19 7.5 19 14.5 19 19.5 19 21 19"
    />
  </svg>
);

export default Tent;
