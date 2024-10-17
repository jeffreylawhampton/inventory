import { Collapse } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import { useSessionStorage } from "@mantine/hooks";
import ItemCountPill from "./ItemCountPill";

const ItemsAccordion = ({ items, activeItem, location }) => {
  const [isOpen, setIsOpen] = useSessionStorage({
    key: location.name,
    defaultValue: true,
  });

  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      <div className="w-fit mb-3">
        <ItemCountPill itemCount={items?.length} isOpen={isOpen} />
      </div>
      <Collapse in={isOpen}>
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
