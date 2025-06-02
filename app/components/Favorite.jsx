import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const Favorite = ({
  onClick,
  item,
  emptyColor = "text-bluegray-700",
  filledColor = "text-danger-400",
  position = "absolute top-4 right-4",
  z = "z-10",
  size = 18,
  strokeWidth = 2,
  classes,
  showDelete = false,
}) => {
  return item?.favorite ? (
    <IconHeartFilled
      size={size}
      tabIndex={0}
      role="button"
      onClick={showDelete ? null : () => onClick(item)}
      className={`${position} ${filledColor} ${z} ${classes} cursor-pointer`}
    />
  ) : (
    <IconHeart
      size={size}
      strokeWidth={strokeWidth}
      tabIndex={0}
      role="button"
      onClick={showDelete ? null : () => onClick(item)}
      className={`${position} ${emptyColor} ${classes} ${z} hover:text-danger-500`}
    />
  );
};

export default Favorite;
