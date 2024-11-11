import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const Favorite = ({
  onClick,
  item,
  emptyColor = "text-bluegray-700",
  filledColor = "text-danger-400",
  position = "absolute top-4 right-4",
  z = "z-10",
  size = 22,
  strokeWidth = 2,
}) => {
  return item?.favorite ? (
    <IconHeartFilled
      size={size}
      onClick={() => onClick(item)}
      className={`${position} ${filledColor} ${z}`}
    />
  ) : (
    <IconHeart
      size={size}
      strokeWidth={strokeWidth}
      onClick={() => onClick(item)}
      className={`${position} ${emptyColor} ${z} hover:text-danger-500`}
    />
  );
};

export default Favorite;
