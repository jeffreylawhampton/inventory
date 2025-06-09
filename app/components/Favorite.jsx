import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const Favorite = ({
  onClick,
  item,
  emptyColor = "text-bluegray-700",
  filledColor = "text-danger-400",
  z = "z-10",
  size = 18,
  strokeWidth = 2,
  classes,
  showDelete = false,
}) => {
  return (
    <button
      onClick={showDelete ? null : () => onClick(item)}
      className="relative focus:!outline-none"
    >
      {item?.favorite ? (
        <IconHeartFilled
          size={size}
          className={` ${filledColor} ${z} ${classes} cursor-pointer`}
        />
      ) : (
        <IconHeart
          size={size}
          strokeWidth={strokeWidth}
          className={` ${emptyColor} ${classes} ${z} hover:text-danger-500`}
        />
      )}
    </button>
  );
};

export default Favorite;
