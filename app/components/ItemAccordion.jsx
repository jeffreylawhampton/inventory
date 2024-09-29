import { Accordion } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import { useContext } from "react";
import { AccordionContext } from "../layout";

const ItemsAccordion = ({ items, activeItem, location }) => {
  const { openLocationItems, setOpenLocationItems } =
    useContext(AccordionContext);

  const handleLocationClick = () => {
    setOpenLocationItems(
      openLocationItems?.includes(location.name)
        ? openLocationItems.filter((name) => name != location.name)
        : [...openLocationItems, location.name]
    );
  };

  const isOpen = openLocationItems?.includes(location.name);

  return (
    <Accordion
      value={openLocationItems}
      onChange={handleLocationClick}
      chevronPosition="left"
      classNames={{
        root: `${
          activeItem?.name === location.name ? "hidden" : ""
        } relative  !my-0 w-full`,
        chevron: "p-0 !ml-2",
        label: "!font-semibold !text-sm ",
        content: "!p-0 flex flex-col gap-3",
        control: "!p-0 !pl-1",
        panel: "!px-0 rounded-b-lg mt-[-3px] !overflow-x-hidden",
      }}
      styles={{}}
    >
      <Accordion.Item
        key={location.name}
        id={location.name}
        value={location.name}
        className="!border-none"
      >
        <Accordion.Control>
          {`${isOpen ? "Hide" : "Show"} items`}
        </Accordion.Control>
        <Accordion.Panel>
          <div className="flex flex-col gap-3">
            {items?.map((item) => (
              <DraggableItemCard
                item={item}
                activeItem={activeItem}
                key={item.name}
              />
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ItemsAccordion;
