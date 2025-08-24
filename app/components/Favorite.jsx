import { Heart } from "lucide-react";
import { useContext } from "react";
import { DeviceContext } from "../providers";

const Favorite = ({
  onClick,
  item,
  emptyColor = "text-bluegray-600",
  filledColor = "text-danger-400",
  z = "z-10",
  size = 18,
  classes,
}) => {
  const { showDelete } = useContext(DeviceContext);
  return (
    <button
      onClick={() => onClick(item)}
      className={`${showDelete ? "" : "relative"} focus:!outline-none`}
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
