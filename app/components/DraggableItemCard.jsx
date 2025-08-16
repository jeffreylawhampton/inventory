import { useState, useContext } from "react";
import { Draggable, Favorite, LucideIcon } from ".";
import { DeviceContext } from "../providers";

const DraggableItemCard = ({
  item,
  activeItem,
  handleItemFavoriteClick,
  showDelete,
  handleClick,
  isSelected,
  bg = "bg-white",
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { isMobile } = useContext(DeviceContext);
  return activeItem?.name === item.name ? null : (
    <Draggable
      key={item.name}
      id={item.name}
      item={item}
      activeItem={activeItem}
      type="item"
      left="left-2"
      top="top-4"
    >
      <div
        className={`${bg} text-black flex !w-full items-center justify-start gap-2 py-3 pr-1 relative rounded cursor-pointer ${
          showDelete
            ? isSelected
              ? "!bg-danger-400 text-white"
              : "opacity-30 hover:bg-danger-100"
            : " hover:bg-bluegray-100"
        } ${isMobile ? "pl-7" : "pl-4"}`}
      >
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => handleClick(item)}
          role="button"
          tabIndex={0}
        />

        <LucideIcon
          iconName={item?.icon}
          type="item"
          fill="none"
          stroke="black"
          size={18}
        />
        <h1 className="text-base font-semibold py-1 leading-tight">
          {item?.name}
        </h1>
        <Favorite
          item={item}
          onClick={
            showDelete
              ? () => handleClick(item)
              : () => handleItemFavoriteClick(item)
          }
          size={18}
        />
      </div>
    </Draggable>
  );
};

export default DraggableItemCard;
