"use client";
import Tooltip from "../components/Tooltip";
import Droppable from "./Droppable";
import ContainerAccordion from "../components/ContainerAccordion";
import DraggableItemCard from "../components/DraggableItemCard";
import { IconExternalLink, IconX } from "@tabler/icons-react";
import { v4 } from "uuid";
import Link from "next/link";
import ItemsAccordion from "../components/ItemAccordion";
import LocationAccordion from "../components/LocationAccordion";

const Location = ({ location, activeItem, setFilters }) => {
  const handleX = (locId) => {
    setFilters((prev) => prev.filter((loc) => loc != locId));
  };

  return (
    <>
      <Droppable
        key={v4()}
        id={location.name}
        item={location}
        className="relative cursor-pointer flex flex-col gap-2 px-3 py-5 rounded-xl min-h-[200px]  overlay-y scroll-smooth !overflow-x-hidden bg-bluegray-200 "
      >
        <div className="flex w-full justify-between items-center mb-2">
          <Tooltip label={`Go to ${location?.name}`} delay={300} position="top">
            <Link href={`/locations/${location.id}`}>
              <h2 className="font-semibold text-xl flex gap-1 items-center hover:scale-(110%) transition-all text-black hover:text-primary-600">
                {location.name}
                <IconExternalLink
                  size={18}
                  aria-label={`Go to ${location?.name}`}
                  onClick={() => router.push(`/locations/${location.id}`)}
                />
              </h2>
            </Link>
          </Tooltip>
          <div className="flex gap-2">
            <Tooltip label="Hide" delay={700} position="top">
              <IconX
                aria-label={`Close ${location?.name}`}
                className="hover:scale-[115%] transition-all"
                onClick={() => handleX(location.id)}
              />
            </Tooltip>
          </div>
        </div>
        {location?.items?.length ? (
          <ItemsAccordion
            location={location}
            activeItem={activeItem}
            bgColor="!bg-bluegray-100"
            items={location?.items}
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
      </Droppable>
    </>
  );
};

export default Location;
