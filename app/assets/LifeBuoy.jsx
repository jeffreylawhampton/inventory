import React from "react";

const LifeBuoy = ({
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
    viewBox="0 0 22 22"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill={fill}
      stroke="none"
      d="M18.07,3.93c-1.81-1.81-4.31-2.93-7.07-2.93s-5.26,1.12-7.07,2.93-2.93,4.31-2.93,7.07,1.12,5.26,2.93,7.07,4.31,2.93,7.07,2.93,5.26-1.12,7.07-2.93,2.93-4.31,2.93-7.07-1.12-5.26-2.93-7.07ZM11,15c-1.1,0-2.1-.45-2.83-1.17-.72-.73-1.17-1.73-1.17-2.83s.45-2.1,1.17-2.83c.73-.72,1.73-1.17,2.83-1.17s2.1.45,2.83,1.17c.72.73,1.17,1.73,1.17,2.83s-.45,2.1-1.17,2.83c-.73.72-1.73,1.17-2.83,1.17Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M18.07,3.93c-1.81-1.81-4.31-2.93-7.07-2.93s-5.26,1.12-7.07,2.93-2.93,4.31-2.93,7.07,1.12,5.26,2.93,7.07,4.31,2.93,7.07,2.93,5.26-1.12,7.07-2.93,2.93-4.31,2.93-7.07-1.12-5.26-2.93-7.07ZM11,15c-1.1,0-2.1-.45-2.83-1.17-.72-.73-1.17-1.73-1.17-2.83s.45-2.1,1.17-2.83c.73-.72,1.73-1.17,2.83-1.17s2.1.45,2.83,1.17c.72.73,1.17,1.73,1.17,2.83s-.45,2.1-1.17,2.83c-.73.72-1.73,1.17-2.83,1.17Z"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M3.93,3.93l4.24,4.24"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13.83,8.17l4.24-4.24"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M13.83,13.83l4.24,4.24"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M8.17,13.83l-4.24,4.24"
    />
  </svg>
);

export default LifeBuoy;

{
  /* <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
  <defs>
    <style>
      .cls-1 {
        fill: #fcb6b6;
      }

      .cls-2 {
        fill: none;
        stroke: #000;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
      }
    </style>
  </defs>
  <path fill={fill} stroke="none" d="M18.07,3.93c-1.81-1.81-4.31-2.93-7.07-2.93s-5.26,1.12-7.07,2.93-2.93,4.31-2.93,7.07,1.12,5.26,2.93,7.07,4.31,2.93,7.07,2.93,5.26-1.12,7.07-2.93,2.93-4.31,2.93-7.07-1.12-5.26-2.93-7.07ZM11,15c-1.1,0-2.1-.45-2.83-1.17-.72-.73-1.17-1.73-1.17-2.83s.45-2.1,1.17-2.83c.73-.72,1.73-1.17,2.83-1.17s2.1.45,2.83,1.17c.72.73,1.17,1.73,1.17,2.83s-.45,2.1-1.17,2.83c-.73.72-1.73,1.17-2.83,1.17Z"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M18.07,3.93c-1.81-1.81-4.31-2.93-7.07-2.93s-5.26,1.12-7.07,2.93-2.93,4.31-2.93,7.07,1.12,5.26,2.93,7.07,4.31,2.93,7.07,2.93,5.26-1.12,7.07-2.93,2.93-4.31,2.93-7.07-1.12-5.26-2.93-7.07ZM11,15c-1.1,0-2.1-.45-2.83-1.17-.72-.73-1.17-1.73-1.17-2.83s.45-2.1,1.17-2.83c.73-.72,1.73-1.17,2.83-1.17s2.1.45,2.83,1.17c.72.73,1.17,1.73,1.17,2.83s-.45,2.1-1.17,2.83c-.73.72-1.73,1.17-2.83,1.17Z"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M3.93,3.93l4.24,4.24"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M13.83,8.17l4.24-4.24"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M13.83,13.83l4.24,4.24"/>
  <path fill="none" stroke={stroke ?? color} strokeWidth={strokeWidth} d="M8.17,13.83l-4.24,4.24"/>
</svg> */
}
