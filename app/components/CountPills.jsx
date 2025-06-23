import { Box, Layers, Heart } from "lucide-react";
import { getTextColor } from "../lib/helpers";

const CountPills = ({
  containerCount,
  itemCount,
  transparent,
  textClasses,
  showEmpty = true,
  showItems,
  showContainers,
  showFavorite,
  handleFavoriteClick,
  handleContainerClick,
  handleCategoryClick,
  item,
  red,
  showDelete,
  height = 27,
}) => {
  const pillClasses = `gap-[3px] justify-center items-center ${textClasses} ${
    transparent ? `bg-white !bg-opacity-25` : "bg-white"
  } rounded-full px-2.5 py-[1px] font-semibold point`;

  const wrapperClasses = "flex gap-1 pl-0 @sm:pl-2 h-[25px]";

  const clickableClasses =
    "relative hover:!bg-opacity-35 active:!bg-opacity-40";

  const empty = showEmpty ? "opacity-50" : "";

  return (
    <div
      className={
        (showItems && showContainers) || (showItems && showFavorite)
          ? wrapperClasses
          : null
      }
    >
      {showFavorite ? (
        <button
          onClick={showDelete ? null : () => handleFavoriteClick(item)}
          className={`${pillClasses} ${
            handleFavoriteClick && clickableClasses
          } ${!transparent && "text-bluegray-700"} ${
            red && "!bg-transparent h-[25px] mt-1 px-[3px]"
          }`}
        >
          {item?.favorite ? (
            <Heart
              size={16}
              aria-label="Favorite"
              className={red ? "text-danger-500 fill-danger-500" : ""}
              style={{
                fill: red ? "" : getTextColor(item?.color?.hex),
              }}
            />
          ) : (
            <Heart
              size={red ? 0 : 16}
              strokeWidth={2}
              aria-label="Not a favorite"
            />
          )}
        </button>
      ) : null}

      {showContainers ? (
        <button
          onClick={handleContainerClick}
          className={`flex min-w-12 ${pillClasses} ${
            handleContainerClick && clickableClasses
          } ${!containerCount && !transparent && "text-bluegray-700"}`}
        >
          <Box
            size={15}
            strokeWidth={1.5}
            className={containerCount ? "" : empty}
          />{" "}
          <span className={containerCount ? "" : empty}>{containerCount}</span>
        </button>
      ) : null}
      {showItems ? (
        <button
          onClick={
            handleContainerClick
              ? handleContainerClick
              : handleCategoryClick
              ? () => handleCategoryClick(item)
              : null
          }
          className={`flex min-w-12 ${pillClasses} ${
            handleContainerClick && clickableClasses
          } ${!itemCount && !transparent && "text-bluegray-700"}`}
        >
          <Layers
            size={15}
            strokeWidth={1.5}
            className={itemCount ? "" : empty}
          />

          <span className={itemCount ? "" : empty}>{itemCount}</span>
        </button>
      ) : null}
    </div>
  );
};

export default CountPills;
