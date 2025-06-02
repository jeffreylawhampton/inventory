const ItemIcon = ({
  width,
  height,
  strokeWidth = 3,
  isSelected,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      data-active={isSelected}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 78.74 58.17"
    >
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12.06,57.44H.72v-10.26h11.33s.01,0,.01,0v10.26Z"
      />
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M78.02,57.44H20.7v-10.26h57.27c.05-.01.05,0,.05,0v10.26Z"
      />
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M78.02,34.22H20.7v-10.26h57.27c.05-.01.05,0,.05,0v10.26Z"
      />
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M78.02,10.99H20.7V.73h57.27c.05-.01.05,0,.05,0v10.26Z"
      />
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12.06,34.22H.72v-10.26h11.33s.01,0,.01,0v10.26Z"
      />
      <path
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12.06,10.97s0,.01-.01.01H.73s-.01,0-.01-.01V.73h11.33s.01,0,.01,0v10.24Z"
      />
    </svg>
  );
};

export default ItemIcon;
