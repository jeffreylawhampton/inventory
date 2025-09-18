import React from "react";

const Tractor = ({
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
    viewBox="0 0 21.8 18"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M20.8,10l-.67,4.16c-.07.48-.49.84-.98.84h-.15c0,1.1-.9,2-2,2s-2-.9-2-2h-5c-.91,1.21-2.37,2-4,2-2.76,0-5-2.24-5-5,0-1.63.79-3.09,2-4V1h7.13c.5,0,.92.37.99.86l.88,6.39,4,.32,4,.33c.51.1.86.58.8,1.1Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M19,15h.15c.49,0,.91-.36.98-.84l.67-4.16c.06-.52-.29-1-.8-1.1l-4-.33-4-.32-3-.25"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="15"
      y1="15"
      x2="10"
      y2="15"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M17,2c-.55,0-1,.45-1,1v5.57"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M12,8.25l-.88-6.39c-.07-.49-.49-.86-.99-.86H2"
    />
    <line
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      x1="3"
      y1="8"
      x2="3"
      y2="1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M6,12h.01"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M7,7.1V1"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="17"
      cy="15"
      r="2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M11,12c0,1.13-.37,2.17-1,3-.91,1.21-2.37,2-4,2-2.76,0-5-2.24-5-5,0-1.63.79-3.09,2-4,.83-.63,1.87-1,3-1,.34,0,.68.03,1,.1.74.15,1.42.46,2,.9,1.21.91,2,2.37,2,4Z"
    />
  </svg>
);

export default Tractor;
