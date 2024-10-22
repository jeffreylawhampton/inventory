import { Collapse } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import ItemCountPill from "./ItemCountPill";
import { useState } from "react";

const ItemsAccordion = ({ items, activeItem }) => {
  const [showItems, setShowItems] = useState(false);

  return (
    <div>
      <div className="w-fit mb-3" onClick={() => setShowItems(!showItems)}>
        <ItemCountPill itemCount={items?.length} isOpen={showItems} />
      </div>
      <Collapse in={showItems}>
        <div className="flex flex-col gap-3 mb-2">
          {items?.map((item) => (
            <DraggableItemCard
              item={item}
              activeItem={activeItem}
              key={item.name}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ItemsAccordion;
