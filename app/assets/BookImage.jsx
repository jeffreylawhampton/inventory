import React from "react";

const BookImage = ({
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
    viewBox="0 0 18 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M1,18.5V3.5c0-1.38,1.12-2.5,2.5-2.5h12.5c.55,0,1,.45,1,1v18c0,.55-.45,1-1,1H3.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5h13.5" />
    <path d="M17,12.7l-2.1-2.1c-.78-.76-2.02-.76-2.8,0l-5.4,5.4" />
    <circle cx="7" cy="7" r="2" />
  </svg>
);

export default BookImage;
