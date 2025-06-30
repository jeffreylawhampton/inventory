import { Heart } from "lucide-react";
const Favorite = ({
  onClick,
  item,
  emptyColor = "text-bluegray-700",
  filledColor = "text-danger-400",
  z = "z-10",
  size = 18,
  classes,
  showDelete = false,
}) => {
  return (
    <button
      onClick={showDelete ? null : () => onClick(item)}
      className="relative focus:!outline-none"
    >
      <Heart
        fill={item?.favorite ? "var(--mantine-color-danger-3)" : "none"}
        size={size}
        className={`cursor-pointer ${z} ${classes} ${
          item?.favorite ? filledColor : emptyColor
        }
        `}
      />
    </button>
  );
};

export default Favorite;
