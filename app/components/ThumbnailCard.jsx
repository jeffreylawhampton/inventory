import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@mantine/hooks";
import HoverCard from "./HoverCard";
import ThumbnailIcon from "./ThumbnailIcon";
import { getTextColor } from "../lib/helpers";
import { DeviceContext } from "../providers";
import DeleteSelector from "./DeleteSelector";

const ThumbnailCard = ({
  item,
  type,
  path,
  showLocation,
  onClick,
  showDelete,
  isSelected,
  handleSelect,
}) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { isMobile } = useContext(DeviceContext);

  const ref = useClickOutside(() => {
    setTimeout(() => {
      setVisible(false);
    }, 250);
  });

  const handleEscape = (e) => {
    if (e.key === "Escape" || e.keyCode === 27 || e.key === "Esc") {
      return setVisible(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
    <span className="relative">
      <HoverCard
        item={item}
        type={type}
        showLocation={showLocation}
        path={path}
        visible={visible}
        setVisible={setVisible}
        handleClick={handleClick}
      >
        <div
          onClick={showDelete ? () => handleSelect(item.id) : handleClick}
          className="group"
        >
          <div
            className={`${
              showDelete
                ? isSelected
                  ? "border-[3px] border-danger-400"
                  : "opacity-10"
                : ""
            } flex flex-col items-center justify-center w-full aspect-square relative rounded-lg group-hover:brightness-[85%] group-active:brightness-[75%] shadow-md group-active:shadow-none`}
            style={{
              background: `url(${image}) center center / cover no-repeat, ${
                item?.color?.hex ?? "var(--mantine-color-bluegray-1)"
              }`,
            }}
          >
            {item?.images?.length ? (
              <div />
            ) : (
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
          {isMobile ? null : (
            <h2 className="truncate w-full text-[14px] my-2 text-center font-medium">
              {item?.name}
            </h2>
          )}
        </div>
      </HoverCard>

      {isMobile ? (
        <h2
          ref={ref}
          onClick={() => setVisible(!visible)}
          onKeyDown={handleEscape}
          className="truncate w-full text-[14px] mt-3 mb-2 text-center font-medium cursor-pointer"
        >
          {item?.name}
        </h2>
      ) : null}

      {showDelete ? (
        <div className="absolute top-2.5 right-2.5">
          <DeleteSelector
            isSelectedForDeletion={isSelected}
            iconSize={16}
            circleSize="w-4 h-4"
          />
        </div>
      ) : null}
    </span>
  );
};

export default ThumbnailCard;
