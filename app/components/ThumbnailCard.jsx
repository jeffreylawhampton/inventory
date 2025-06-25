import ThumbnailIcon from "./ThumbnailIcon";
import { useRouter } from "next/navigation";
import { getTextColor } from "../lib/helpers";
import HoverCard from "./HoverCard";
const ThumbnailCard = ({ item, type, path, showLocation }) => {
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

  let image = "";
  if (type === "item" && item?.images?.length) {
    image =
      item?.images?.find((i) => i.featured)?.secureUrl ??
      item?.images[0]?.secureUrl;
  }

  return (
    <HoverCard item={item} type={type} showLocation={showLocation} path={path}>
      <div
        onClick={() => router.push(path)}
        role="button"
        tabIndex={0}
        className="hover:brightness-[85%] active:brightness-[75%] transition ease-in-out duration-300 shadow-md active:shadow-none overflow-hidden rounded-lg"
      >
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full aspect-square relative select-none touch-manipulation"
          style={{
            background: `url(${image}) center center / cover no-repeat, ${
              item?.color?.hex ?? "var(--mantine-color-bluegray-1)"
            }`,
          }}
        >
          {item?.images?.length ? null : (
            <ThumbnailIcon
              iconName={iconName}
              size={36}
              type={type}
              fill="transparent"
              stroke={
                type === "item" ? "black" : getTextColor(item?.color?.hex)
              }
            />
          )}
        </div>
      </div>
      <h2 className="truncate w-full text-[14px] mt-1 text-center font-medium">
        {item?.name}
      </h2>
    </HoverCard>
  );
};

export default ThumbnailCard;
