import React from "react";

const Rake = ({
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
    viewBox="0 0 21 22.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M5.33,6.37h2v16.73c0,.55-.45,1-1,1h0c-.55,0-1-.45-1-1V6.37h0Z"
      transform="translate(11.37 -.48) rotate(40.34)"
    />
    <rect
      fill={fill}
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x="4.33"
      y="6.84"
      width="16.69"
      height="1.86"
      rx=".22"
      ry=".22"
      transform="translate(8.04 -6.36) rotate(40.34)"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="9.78"
      y1=".24"
      x2="7.88"
      y2="2.48"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="11.13"
      y1="1.39"
      x2="9.23"
      y2="3.62"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="12.48"
      y1="2.53"
      x2="10.58"
      y2="4.77"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="13.82"
      y1="3.68"
      x2="11.93"
      y2="5.91"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="15.17"
      y1="4.82"
      x2="13.28"
      y2="7.06"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="16.52"
      y1="5.97"
      x2="14.63"
      y2="8.2"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="17.87"
      y1="7.12"
      x2="15.98"
      y2="9.35"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="19.22"
      y1="8.26"
      x2="17.32"
      y2="10.49"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="20.57"
      y1="9.41"
      x2="18.67"
      y2="11.64"
    />
  </svg>
);

export default Rake;
