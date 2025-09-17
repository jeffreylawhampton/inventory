import React from "react";

const Gamepad2 = ({
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
    viewBox="0 0 22 16"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={fill}
    stroke={stroke ?? color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      class="cls-1"
      d="M16.32,1H5.68c-2.05,0-3.77,1.55-3.98,3.59,0,.05,0,.1-.02.15-.08.67-.68,5.71-.68,7.26,0,1.66,1.34,3,3,3,1,0,1.5-.5,2-1l1.41-1.41c.37-.38.88-.59,1.41-.59h4.34c.53,0,1.04.21,1.41.59l1.41,1.41c.5.5,1,1,2,1,1.66,0,3-1.34,3-3,0-1.55-.6-6.58-.68-7.26,0-.05-.01-.1-.02-.15-.21-2.04-1.93-3.59-3.98-3.59Z"
    />
    <line class="cls-2" x1="5" y1="7" x2="9" y2="7" />
    <line class="cls-2" x1="7" y1="5" x2="7" y2="9" />
    <line class="cls-2" x1="14" y1="8" x2="14.01" y2="8" />
    <line class="cls-2" x1="17" y1="6" x2="17.01" y2="6" />
  </svg>
);

export default Gamepad2;
