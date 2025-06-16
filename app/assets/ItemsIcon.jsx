const ItemsIcon = ({ width, height, fill, strokeWidth = 6, isSelected }) => {
  return (
    <svg
      width={width}
      height={height}
      data-active={isSelected}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 109.37 110.16"
    >
      <path
        strokeWidth={strokeWidth}
        fill={fill}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M28.14,67.55l-24.26,12.13c-.99.5-.99,1.91,0,2.4l49.92,24.96c.64.32,1.39.32,2.03,0l49.92-24.96c.99-.5.99-1.91,0-2.4l-24.26-12.13"
      />
      <path
        strokeWidth={strokeWidth}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        d="M28.14,41.88L3.89,54.01c-1,.5-1,1.92,0,2.42l50.19,25.09c.46.23,1,.23,1.46,0l50.19-25.09c1-.5,1-1.92,0-2.42l-24.25-12.13"
      />
      <polyline
        opacity={0.15}
        fill="none"
        strokeWidth={strokeWidth + 2}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="7.7 56.21 28.02 46.09 54.81 59.36 80.97 46.09 101.44 56.21"
      />
      <polyline
        opacity={0.2}
        fill="none"
        strokeWidth={strokeWidth + 2}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="7.94 81.55 28.26 71.43 55.05 84.7 81.21 71.43 101.68 81.55"
      />
      <path
        strokeWidth={strokeWidth}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        d="M54.81,2.88L3.86,28.35c-.98.49-.98,1.89,0,2.38l50.95,25.47,50.95-25.47c.98-.49.98-1.89,0-2.38L54.81,2.88"
      />
      <path
        strokeWidth={strokeWidth}
        fill={fill}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.3}
        d="M54.57,2.88L3.62,28.35c-.98.49-.98,1.89,0,2.38l50.95,25.47,50.95-25.47c.98-.49.98-1.89,0-2.38L54.57,2.88"
      />
    </svg>
  );
};
export default ItemsIcon;
