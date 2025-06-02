const HomeIcon = ({ width, height, strokeWidth = 3, isSelected }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 97.54 90.22"
      data-active={isSelected}
    >
      <path
        stroke="black"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        d="M80.55,88.5c.26,0,.47-.21.47-.47v-40.97h14.32c.43,0,.64-.52.33-.82l-16.03-15.28-.68-.64V11.15c0-.26-.21-.47-.47-.47h-7.83c-.26,0-.47.21-.47.47v10.6c0,.07-.08.1-.13.06l-3.55-3.38L49.1,1.85c-.18-.17-.47-.17-.65,0L1.87,46.24c-.31.3-.1.82.33.82h14.45v40.97c0,.26.21.47.47.47h18.98c.26,0,.47-.21.47-.47v-23.86c0-.95.39-1.83,1.02-2.45h0c.63-.63,1.49-1.02,2.44-1.02h17.46c.95,0,1.81.4,2.44,1.02h0c.63.63,1.03,1.49,1.03,2.45v23.86c0,.26.21.47.47.47h19.1Z"
      />
    </svg>
  );
};

export default HomeIcon;
