import React from "react";

const Handbag = ({
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
    viewBox="0 0 22 21"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M21,18c0,1.1-.9,2-2,2H3c-.15,0-.29-.02-.43-.05-1.08-.24-1.76-1.31-1.52-2.38l2-9c.2-.92,1.01-1.57,1.95-1.57h12c.94,0,1.75.65,1.95,1.57l2,9c.03.14.05.28.05.43Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M21,18c0,1.1-.9,2-2,2H3c-.15,0-.29-.02-.43-.05-1.08-.24-1.76-1.31-1.52-2.38l2-9c.2-.92,1.01-1.57,1.95-1.57h12c.94,0,1.75.65,1.95,1.57l2,9c.03.14.05.28.05.43Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M7,10v-5c0-2.21,1.79-4,4-4s4,1.79,4,4v5"
    />
  </svg>
);

export default Handbag;

{
  /* <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21">
  <defs>
    <style>
      .cls-1 {
        fill: none;
        stroke: #000;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
      }

      .cls-2 {
        fill: #eac5c5;
      }
    </style>
  </defs>
  <path fill={fill} stroke="none" d="M21,18c0,1.1-.9,2-2,2H3c-.15,0-.29-.02-.43-.05-1.08-.24-1.76-1.31-1.52-2.38l2-9c.2-.92,1.01-1.57,1.95-1.57h12c.94,0,1.75.65,1.95,1.57l2,9c.03.14.05.28.05.43Z"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M21,18c0,1.1-.9,2-2,2H3c-.15,0-.29-.02-.43-.05-1.08-.24-1.76-1.31-1.52-2.38l2-9c.2-.92,1.01-1.57,1.95-1.57h12c.94,0,1.75.65,1.95,1.57l2,9c.03.14.05.28.05.43Z"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M7,10v-5c0-2.21,1.79-4,4-4s4,1.79,4,4v5"/>
</svg> */
}
