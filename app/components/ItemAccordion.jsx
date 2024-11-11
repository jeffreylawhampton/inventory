import { useContext, useEffect } from "react";
import { Collapse } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import ItemCountPill from "./ItemCountPill";
import { AccordionContext } from "../layout";

const ItemsAccordion = ({
  items,
  activeItem,
  handleItemFavoriteClick,
  location,
  openLocationItems,
  setOpenLocationItems,
}) => {
  const isOpen = openLocationItems?.includes(location);
  const handleToggle = () => {
    isOpen
      ? setOpenLocationItems(
          openLocationItems?.filter((loc) => loc != location)
        )
      : setOpenLocationItems([...openLocationItems, location]);
  };

  return (
    <div>
      <div className="w-fit mb-3" onClick={handleToggle}>
        <ItemCountPill itemCount={items?.length} isOpen={isOpen} />
      </div>
      <Collapse in={isOpen}>
        <div className="flex flex-col gap-3 mb-2">
          {items?.map((item) => (
            <DraggableItemCard
              item={item}
              activeItem={activeItem}
              key={item.name}
              handleItemFavoriteClick={handleItemFavoriteClick}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ItemsAccordion;
