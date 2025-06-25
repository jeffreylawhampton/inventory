import ThumbnailIcon from "./ThumbnailIcon";
import { useRouter } from "next/navigation";
import { getTextColor } from "../lib/helpers";
import HoverCard from "./HoverCard";
import { handlePreventLongPress } from "../items/handlers";
const ThumbnailCard = ({ item, type, path, showLocation, onClick }) => {
  const router = useRouter();

  let iconName = item?.icon;

  if (!iconName) {
    switch (type) {
      case "item": {
        iconName = "Layers";
        break;
      }
      case "container": {
        iconName = "Box";
        break;
      }
      case "category": {
        iconName = "Tag";
        break;
      }
      default:
        iconName = "Layers";
    }
  }

  const handleClick = () => {
    if (onClick) onClick();
    router.push(path);
  };

  let image = "";
  if (type === "item" && item?.images?.length) {
    image =
      item?.images?.find((i) => i.featured)?.secureUrl ??
      item?.images[0]?.secureUrl;
  }

  return (
    <div
      className="relative group w-full h-full select-none"
      onContextMenu={handlePreventLongPress}
      onTouchStart={handlePreventLongPress}
    >
      <HoverCard
        item={item}
        type={type}
        showLocation={showLocation}
        path={path}
      >
        <div
          className="w-full h-full absolute top-0 left-0 z-30 select-none touch-manipulation"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onContextMenu={handlePreventLongPress}
          onTouchStart={handlePreventLongPress}
        />

        <div
          onContextMenu={handlePreventLongPress}
          onTouchStart={handlePreventLongPress}
          className="flex flex-col items-center justify-center w-full aspect-square relative select-none touch-manipulation rounded-lg group-hover:brightness-[85%] group-active:brightness-[75%] shadow-md group-active:shadow-none"
          style={{
            background: `url(${image}) center center / cover no-repeat, ${
              item?.color?.hex ?? "var(--mantine-color-bluegray-1)"
            }`,
          }}
        >
          {item?.images?.length ? null : (
            <ThumbnailIcon
              iconName={iconName}
              type={type}
              fill="transparent"
              stroke={
                type === "item" ? "black" : getTextColor(item?.color?.hex)
              }
            />
          )}
        </div>
        <h2
          onContextMenu={handlePreventLongPress}
          onTouchStart={handlePreventLongPress}
          className="truncate w-full text-[14px] mt-1 text-center font-medium !select-none !touch-none"
        >
          {item?.name}
        </h2>
      </HoverCard>
    </div>
  );
};

export default ThumbnailCard;
