import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const Favorite = ({
  onClick,
  isFavorite,
  emptyColor = "text-bluegray-600",
  filledColor = "text-danger-400",
  position = "absolute top-4 right-4",
  z = "z-10",
}) => {
  return isFavorite ? (
    <IconHeartFilled
      size={24}
      onClick={onClick}
      className={`${position} ${filledColor} ${z}`}
    />
  ) : (
    <IconHeart
      size={24}
      onClick={onClick}
      className={`${position} ${emptyColor} ${z}`}
    />
  );
};

export default Favorite;
