import { Accordion } from "@mantine/core";
import DraggableItemCard from "./DraggableItemCard";
import { useContext } from "react";
import { AccordionContext } from "../layout";
import ItemsAccordion from "./ItemAccordion";
import ContainerAccordion from "./ContainerAccordion";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconExternalLink,
  IconBox,
  IconClipboardList,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

const LocationAccordion = ({ location, activeItem }) => {
  const { openLocations, setOpenLocations } = useContext(AccordionContext);

  const { isOver, setNodeRef } = useDroppable({
    id: location.id,
    data: { item: location },
  });

  const handleLocationClick = () => {
    setOpenLocations(
      openLocations?.includes(location.name)
        ? openLocations.filter((name) => name != location.name)
        : [...openLocations, location.name]
    );
  };

  const isOpen = openLocations?.includes(location.name);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl ${isOver ? "brightness-75" : ""}`}
    >
      <div className="bg-bluegray-200 w-full rounded-xl pt-4 pb-5 px-4 relative">
        <div className="flex w-full justify-between items-center my-3">
          <Link
            className="flex gap-1 items-center w-fit hover:text-primary-500 font-semibold text-xl pl-2"
            href={`/locations/${location.id}`}
          >
            {location.name}{" "}
            <IconExternalLink size={18} aria-label="Go to location page" />
          </Link>

          <div className="flex gap-3 my-2 pl-2" onClick={handleLocationClick}>
            <div className="flex gap-[4px] justify-center items-center bg-bluegray-400 rounded-full px-3 py-[1px] font-medium">
              <IconBox size={18} /> {location?._count.containers}
            </div>
            <div className="flex gap-[4px] justify-center items-center bg-bluegray-400 rounded-full px-3 py-[1px] font-medium">
              <IconClipboardList size={18} /> {location?._count.items}
            </div>
            {location.items?.length || location.containers?.length ? (
              <IconChevronDown
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            ) : null}
          </div>
        </div>

        <Collapse in={openLocations?.includes(location.name)}>
          <div className="flex flex-col gap-3">
            {location.items?.length ? (
              <ItemsAccordion
                items={location.items}
                activeItem={activeItem}
                location={location}
              />
            ) : null}

            {location?.containers?.map((container) => {
              return (
                <ContainerAccordion
                  key={container.name}
                  container={container}
                  activeItem={activeItem}
                />
              );
            })}
          </div>
        </Collapse>
        {/* {!openLocations?.includes(location.name) ? (
          <div className="flex gap-3 my-2 pl-2">
            <div className="flex gap-[4px] justify-center items-center bg-primary-300 rounded-full px-3 py-[1px] font-medium">
              <IconBox size={18} /> {location?._count.containers}
            </div>
            <div className="flex gap-[4px] justify-center items-center bg-primary-300 rounded-full px-3 py-[1px] font-medium">
              <IconClipboardList size={18} /> {location?._count.items}
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default LocationAccordion;
