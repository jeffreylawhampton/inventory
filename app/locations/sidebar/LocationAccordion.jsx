import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";
import { DeviceContext } from "@/app/layout";
import { Collapse } from "@mantine/core";
import { DeleteSelector } from "@/app/components";
import ContainerAccordion from "./ContainerAccordion";
import { sortObjectArray, buildContainerTree } from "../../lib/helpers";
import { LocationContext } from "../layout";
import DraggableItem from "./SidebarItem";
import { IconChevronRight } from "@tabler/icons-react";
import { ItemIcon, ClosedBoxIcon } from "@/app/assets";

const LocationAccordion = ({ location }) => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  let id = params.get("id");
  if (id == "null") id = null;

  const {
    openLocations,
    setOpenLocations,
    showDelete,
    selectedForDeletion,
    handleSelectForDeletion,
  } = useContext(LocationContext);
  const { isMobile } = useContext(DeviceContext);

  location = { ...location, type: "location" };
  const { isOver, setNodeRef } = useDroppable({
    id: location.id ?? "no-location",
    data: { item: location },
  });

  const handleLocationClick = () => {
    setOpenLocations(
      openLocations?.includes(location.name)
        ? openLocations?.filter((name) => name != location.name)
        : [...openLocations, location.name]
    );
  };

  const isOpen = openLocations?.includes(location.name);
  const unflattened = sortObjectArray(buildContainerTree(location.containers));
  const hasContents = location.containers?.length || location.items?.length;
  const isSelected = showDelete
    ? selectedForDeletion?.find((i) => i.name === location.name)
    : type === "location" && id == location.id;

  const isNoLocation = location.name && !location.id;

  const accordionClasses = showDelete
    ? `${
        isSelected
          ? "bg-danger-200"
          : isNoLocation
          ? "opacity-40"
          : "opacity-60 hover:bg-danger-100"
      }`
    : `${isOver && "bg-primary-500"} ${
        isSelected
          ? "bg-primary-200"
          : "hover:bg-primary-100 peer-hover:bg-primary-100"
      }`;

  return (
    <li
      className={`rounded-md my-2.5 mx-4 font-semibold text-[15px] relative  border-bluegray-300 bg-bluegray-100`}
    >
      {hasContents ? (
        <button
          onClick={() => handleLocationClick(location.id)}
          className={`absolute z-20 peer group rounded ${
            isSelected ? "hover:bg-primary-300" : "hover:bg-primary-200/70"
          } ${showDelete ? (isSelected ? "hover:bg-danger-300/70" : "") : ""} ${
            isMobile ? "p-1 top-2 left-1" : "p-1 top-2 left-2.5"
          }`}
        >
          <IconChevronRight
            aria-label={isOpen ? "Collapse location" : "Expand location"}
            size={isMobile ? 20 : 18}
            strokeWidth={3}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      ) : null}
      <div
        tabIndex={0}
        ref={setNodeRef}
        role="button"
        className={`py-2.5 pl-10 pr-3 rounded cursor-pointer group flex ${accordionClasses} `}
        onPointerDown={
          showDelete && !isNoLocation
            ? () => handleSelectForDeletion(location)
            : () => router.push(`?type=location&id=${location.id}`)
        }
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=location&id=${location.id}`)
            : null
        }
      >
        <div className="flex justify-between gap-5 w-full h-full">
          <h3 className="text-nowrap flex gap-1.5 items-center [&>svg>path]:fill-bluegray-300">
            {location.name}
          </h3>
          <div className="flex gap-3 text-sm ">
            {location._count?.containers ? (
              <div className={`flex gap-[5px] items-center px-1`}>
                <ClosedBoxIcon
                  width={13}
                  height={13}
                  strokeWidth={6}
                  fill="transparent"
                  aria-label="Container count"
                />
                {location._count?.containers}
              </div>
            ) : null}
            {location._count?.items ? (
              <div className={`flex gap-[5px] items-center px-1 `}>
                <ItemIcon width={13} strokeWidth={0} aria-label="Item count" />

                {location._count?.items}
              </div>
            ) : null}
          </div>
        </div>
        {showDelete && !isNoLocation ? (
          <DeleteSelector isSelectedForDeletion={isSelected} />
        ) : null}
      </div>

      <Collapse in={openLocations?.includes(location.name)}>
        <ul className="px-2 pb-3">
          {location?.items?.map((item) => {
            item = { ...item, depth: 1 };
            return <DraggableItem item={item} key={item.name} />;
          })}

          {unflattened?.map((container) => {
            return (
              <ContainerAccordion container={container} key={container.name} />
            );
          })}
        </ul>
      </Collapse>
    </li>
  );
};

export default LocationAccordion;
