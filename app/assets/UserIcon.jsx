const UserIcon = ({ classes, width, height, strokeWidth = 5 }) => {
  return (
    <svg
      className={classes}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 46.06 49.97"
    >
      <circle
        stroke="black"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        cx="23.03"
        cy="13.32"
        r="11.88"
      />
      <path
        stroke="black"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        d="M7.18,48.53h31.69c3.96,0,6.86-4.11,5.33-7.77-2.74-6.86-9.29-11.27-16.6-11.27h-9.14c-4.72,0-9.29,1.83-12.64,5.18-1.68,1.68-3.05,3.81-3.96,6.09-1.52,3.66,1.37,7.77,5.33,7.77Z"
      />
    </svg>
  );
};

export default UserIcon;
