import { useState, useContext, useEffect } from "react";
import { useClickOutside } from "@mantine/hooks";
import { DeleteSelector, HoverCard, ThumbnailIcon } from ".";
import { getTextColor } from "../lib/helpers";
import { DeviceContext } from "../providers";

const ThumbnailCard = ({
  item,
  type,
  path,
  showLocation,
  showDelete,
  isSelected,
  handleClick,
}) => {
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
        <div onClick={() => handleClick(item)} className="group">
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
                item?.color?.hex ?? "var(--mantine-color-primary-0)"
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
            <h2 className="truncate w-full text-[14px] my-2 text-center font-semibold">
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
          className="truncate w-full text-[14px] my-2.5 text-center font-semibold cursor-pointer"
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
