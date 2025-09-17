import React from "react";

const Projector = ({
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
    viewBox="0 0 22 19"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle fill={fill} stroke="none" cx="8" cy="11" r="3" />
    <path
      fill={fill}
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M10.83,10h8.17c1.1,0,2,.9,2,2v4c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-4c0-1.1.9-2,2-2h2.17"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M4,5l-2-2"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M8,4V1"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M12,5l2-2"
    />
    <circle
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      cx="8"
      cy="11"
      r="3"
    />
    <path
      fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth}
      d="M15,14h2"
    />
  </svg>
);

export default Projector;

{
  /* <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 19">
  <defs>
    <style>
      .cls-1 {
        fill: none;
      }

      .cls-1, .cls-2 {
        stroke: #000;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
      }

      .cls-2 {
        fill: #e57a7a;
      }

      .cls-3 {
        fill: #e87c7c;
      }
    </style>
  </defs>
  <circle fill={fill} stroke="none" cx="8" cy="11" r="3"/>
  <path fill={fill} stroke={stroke ?? color} strokeWidth={strokeWidth} d="M10.83,10h8.17c1.1,0,2,.9,2,2v4c0,1.1-.9,2-2,2H3c-1.1,0-2-.9-2-2v-4c0-1.1.9-2,2-2h2.17"/>
  <path       fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth} d="M4,5l-2-2"/>
  <path       fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth} d="M8,4V1"/>
  <path       fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth} d="M12,5l2-2"/>
  <circle       fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth} cx="8" cy="11" r="3"/>
  <path       fill="none"
      stroke={stroke ?? color}
      strokeWidth={strokeWidth} d="M15,14h2"/>
</svg> */
}
