import { Accordion, Collapse } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import { useContext } from "react";
import { AccordionContext } from "../layout";
import { useSessionStorage } from "@mantine/hooks";
import ItemCountPill from "./ItemCountPill";

const ItemsAccordion = ({ items, activeItem, location }) => {
  const { openLocationItems, setOpenLocationItems } =
    useContext(AccordionContext);

  const [isOpen, setIsOpen] = useSessionStorage({
    key: location.name,
    defaultValue: true,
  });

  // const handleLocationClick = () => {
  //   setOpenLocationItems(
  //     openLocationItems?.includes(location.name)
  //       ? openLocationItems.filter((name) => name != location.name)
  //       : [...openLocationItems, location.name]
  //   );
  // };

  // const isOpen = openLocationItems?.includes(location.name);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      // chevronPosition="left"
      // classNames={{
      //   root: `${
      //     activeItem?.name === location.name ? "hidden" : ""
      //   } relative  !mt-0 !mb-2 w-full`,
      //   chevron: "p-0 !ml-2",
      //   label: "!font-semibold !text-sm !p-0",
      //   content: "!p-0 flex flex-col gap-3",
      //   control: "!p-0 !pl-1",
      //   panel: "!px-0 rounded-b-lg mt-[-3px] pt-4 !overflow-x-hidden",
      // }}
      // styles={{}}
    >
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
