import React from "react";

const Kayak = ({
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
    viewBox="0 0 20 20"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    fill={fill}
    {...props}
  >
    <path d="M16,15c-.55,0-1,.45-1,1v1c0,1.1.9,2,2,2s2-.9,2-2-.9-2-2-2h-1Z" />
    <path d="M18.97,1.61c.09-.23-.03-.49-.26-.58-.1-.04-.22-.04-.32,0C8.2,4.6,4.6,8.2,1.03,18.39c-.09.23.03.49.26.58.1.04.22.04.32,0C11.8,15.4,15.4,11.8,18.97,1.61" />
    <path d="M4.71,4.71l10.59,10.59" />
    <path d="M5,3c0-1.1-.9-2-2-2S1,1.9,1,3s.9,2,2,2h1c.55,0,1-.45,1-1v-1Z" />
  </svg>
);

export default Kayak;
