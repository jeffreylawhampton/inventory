import React from "react";

const Glue = ({
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
    viewBox="-2 -1 18 25"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.68,22.42H2.51c-1.11,0-2.01-.9-2.01-2.01v-7.93c0-1.11.9-2.01,2.01-2.01h9.17c1.11,0,2.01.9,2.01,2.01v7.93c0,1.11-.9,2.01-2.01,2.01ZM10.97,7.26H3.21c-.36,0-.66.29-.66.66v2.56h9.08v-2.56c0-.36-.29-.66-.66-.66ZM6.33,1.04l-2.15,6.22h5.83L7.86,1.04c-.25-.73-1.28-.73-1.53,0Z" />
  </svg>
);

export default Glue;
