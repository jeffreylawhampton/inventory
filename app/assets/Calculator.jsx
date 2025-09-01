const CalculatorIcon = ({
  width,
  height,
  stroke = "black",
  strokeWidth = 1,
  fill,
}) => {
  return (
    <svg
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={stroke}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16.39 22.88"
    >
      {/* <defs>
        <style>
          .cls-1 {
            fill: none;
          }
    
          .cls-1, .cls-2 {
            stroke: #000;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
    
          .cls-2 {
            fill: #dd2c2c;
          }
        </style>
      </defs> */}
      <path
        fill={fill}
        d="M.5.5v21.88h15.39V.5H.5ZM13.6,7.48H2.78V3.11h10.82v4.37Z"
      />
      <rect fill="none" x="2.78" y="9.64" width="4.38" height="4.38" />
      <rect fill="none" x="9.23" y="9.64" width="4.38" height="4.38" />
      <rect fill="none" x="2.78" y="15.74" width="4.38" height="4.38" />
      <rect fill="none" x="9.23" y="15.74" width="4.38" height="4.38" />
    </svg>
  );
};

export default CalculatorIcon;
