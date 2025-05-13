const LocationIcon = ({ width, height, strokeWidth = 6, isSelected }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 75.31 97.55"
      data-active={isSelected}
    >
      <path
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        stroke="black"
        className={isSelected ? "!fill-primary-700" : ""}
        d="M30.05,75.03c-.27.01-.52.03-.77.05-13.87.97-24.61,4.28-27.07,8.43-.35.59-.53,1.19-.53,1.81,0,5.83,16.11,10.55,35.97,10.55s35.97-4.72,35.97-10.55c0-.62-.18-1.22-.53-1.81-2.47-4.14-13.18-7.46-27-8.43l-.96-.05"
      />
      <path
        stroke="black"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        d="M64.25,17.74c-2.66-4.99-6.48-9-11.05-11.74-4.56-2.75-9.89-4.25-15.55-4.25-11.34,0-21.28,5.98-26.6,15.99-5.33,10.03-4.72,21.62,1.63,31.02l23.48,34.75.34.51c.27.39.7.61,1.15.61s.88-.22,1.15-.61l.34-.51,23.48-34.75c6.35-9.4,6.96-20.99,1.63-31.02ZM37.65,44.34c-7.63,0-13.82-6.2-13.82-13.83s6.19-13.82,13.82-13.82,13.82,6.19,13.82,13.82-6.19,13.83-13.82,13.83Z"
      />
    </svg>
  );
};

export default LocationIcon;
