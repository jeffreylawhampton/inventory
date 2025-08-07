import React from "react";

const SewingMachine = ({
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
    viewBox="-1 -1 22 22"
    fill={fill}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      stroke={stroke ?? color}
      strokeWidth={strokeWidth / 1.3}
      fill={fill}
      d="M16.68,4.36h2.03c.29,0,.53.46.53,1.02v2.06c0,.56-.24,1.02-.53,1.02h-1.61"
    />
    <path
      stroke={stroke ?? color}
      fill={fill}
      d="M18.05,15.51l-.82-7.36-.45-4.09v-.1c-.06-.87-.66-1.54-1.38-1.54H.93c-.38,0-.68.37-.68.82v6.46c-.04.48.28.9.68.9h4.11c.38,0,.68-.37.68-.82v-2.45c0-.45.31-.82.68-.82h4.11c.36,0,.66.34.68.78v8.22h6.85Z"
    />
    <circle
      stroke={stroke ?? color}
      strokeWidth={strokeWidth / 1.5}
      fill={fill}
      cx="14.58"
      cy="10.8"
      r="1.2"
    />
    <circle
      stroke={stroke ?? color}
      strokeWidth={strokeWidth / 1.5}
      fill={fill}
      cx="14.11"
      cy="6.15"
      r="1.5"
    />
    <line
      stroke={stroke ?? color}
      fill={fill}
      x1="2.99"
      y1="13.87"
      x2="2.99"
      y2="10.6"
    />
    <line
      stroke={stroke ?? color}
      fill={fill}
      x1="3.67"
      y1=".25"
      x2="3.67"
      y2="2.43"
    />
    <rect
      stroke={stroke ?? color}
      fill={fill}
      x=".25"
      y="15.51"
      width="18.49"
      height="2.71"
    />
  </svg>
);

export default SewingMachine;

{
  /* <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.5 18.47">
  <defs>
    <style>
      .cls-1 {
        stroke-miterlimit: 10;
      }

      .cls-1, .cls-2 {
        fill: none;
        stroke: #414042;
        stroke-width: .5px;
      }

      .cls-2 {
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    </style>
  </defs>
  <rect class="cls-2" x=".25" y="15.51" width="18.49" height="2.71"/>
  <path class="cls-2" d="M18.05,15.51l-.82-7.36-.45-4.09v-.1c-.06-.87-.66-1.54-1.38-1.54H.93c-.38,0-.68.37-.68.82v6.46c-.04.48.28.9.68.9h4.11c.38,0,.68-.37.68-.82v-2.45c0-.45.31-.82.68-.82h4.11c.36,0,.66.34.68.78v8.22h6.85Z"/>
  <circle class="cls-2" cx="14.58" cy="10.8" r="1.28"/>
  <circle class="cls-2" cx="14.11" cy="6.15" r="1.54"/>
  <line class="cls-2" x1="2.99" y1="13.87" x2="2.99" y2="10.6"/>
  <line class="cls-2" x1="3.67" y1=".25" x2="3.67" y2="2.43"/>
  <path class="cls-1" d="M16.68,4.36h2.03c.29,0,.53.46.53,1.02v2.06c0,.56-.24,1.02-.53,1.02h-1.61"/>
</svg> */
}
