import { useContext, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";
import { AccordionContext, DeviceContext, ModalContext } from "@/app/providers";
import { Collapse } from "@mantine/core";
import { DeleteSelector } from "@/app/components";
import {
  sortObjectArray,
  buildContainerTree,
  handleToggleDelete,
} from "../../lib/helpers";
import { Box, ChevronRight, Layers } from "lucide-react";
import { LocationContext } from "../layout";
import { ContainerAccordion, SidebarItemCard } from "..";

const LocationAccordion = ({ location }) => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  let id = params.get("id");
  if (id == "null") id = null;

  const { sidebarSize } = useContext(LocationContext);
  const { isMobile } = useContext(DeviceContext);
  const { showDelete } = useContext(ModalContext);
  const {
    openLocations,
    setOpenLocations,
    selectedObjects,
    setSelectedObjects,
  } = useContext(AccordionContext);

  const loc = useMemo(() => ({ ...location, type: "location" }), [location]);
  const droppableId = loc.id != null ? `loc-${loc.id}` : "loc-none";

  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: { item: loc },
  });

  const isOpen = openLocations?.includes(loc.name);
  const hasContents = !!(loc.containers?.length || loc.items?.length);
  const isSelected = showDelete
    ? selectedObjects?.find((i) => i.name === loc.name)
    : type === "location" && id == loc.id;
  const isNoLocation = loc.name && !loc.id;

  const accordionClasses = showDelete
    ? isSelected
      ? "bg-danger-200"
      : isNoLocation
      ? "opacity-40"
      : "opacity-60 hover:bg-danger-100"
    : `${isOver ? "bg-primary-500" : ""} ${
        isSelected
          ? "bg-primary-200"
          : "hover:bg-primary-100 peer-hover:bg-primary-100"
      }`;

  const handleToggleOpen = () => {
    setOpenLocations(
      isOpen
        ? openLocations.filter((name) => name !== loc.name)
        : [...openLocations, loc.name]
    );
  };

  const unflattened = useMemo(
    () => sortObjectArray(buildContainerTree(loc.containers)),
    [loc.containers]
  );

  return (
    <li
      className={`rounded-md my-2.5 font-semibold text-[15px] relative border-bluegray-300 bg-bluegray-100 mx-4 ${
        !isMobile && sidebarSize < 15 ? "mr-0" : ""
      }`}
    >
      <div ref={setNodeRef}>
        <div
          tabIndex={0}
          role="button"
          className={`py-3.5 pl-11 pr-3 rounded cursor-pointer group flex ${accordionClasses}`}
          onPointerDown={
            showDelete && !isNoLocation
              ? () =>
                  handleToggleDelete(
                    loc,
                    "name",
                    selectedObjects,
                    setSelectedObjects
                  )
              : () =>
                  router.push(
                    isSelected ? "/locations" : `?type=location&id=${loc.id}`
                  )
          }
          onKeyDown={(e) =>
            e.key === "Enter"
              ? router.push(`?type=location&id=${loc.id}`)
              : null
          }
        >
          {hasContents ? (
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                handleToggleOpen();
              }}
              className={`absolute z-10 peer rounded p-1 left-2 ${
                isSelected ? "hover:bg-primary-300" : "hover:bg-primary-200/70"
              } ${
                showDelete ? (isSelected ? "hover:bg-danger-300/70" : "") : ""
              } ${isMobile ? "top-2.5" : "top-3"}`}
            >
              <ChevronRight
                aria-label={isOpen ? "Collapse location" : "Expand location"}
                size={isMobile ? 22 : 18}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                } pointer-events-none`}
              />
            </button>
          ) : null}

          <div className="flex justify-between gap-5 w-full h-full">
            <h3 className="text-nowrap flex gap-1.5 items-center [&>svg>path]:fill-bluegray-300">
              {loc.name}
            </h3>
            <div className="flex gap-3 text-sm">
              {loc._count?.containers ? (
                <div className="flex gap-[5px] items-center px-1">
                  <Box size={14} aria-label="Container count" />
                  {loc._count.containers}
                </div>
              ) : null}
              {loc._count?.items ? (
                <div className="flex gap-[5px] items-center px-1">
                  <Layers size={14} />
                  {loc._count.items}
                </div>
              ) : null}
            </div>
          </div>

          {showDelete && !isNoLocation ? (
            <DeleteSelector isSelectedForDeletion={!!isSelected} />
          ) : null}
        </div>
      </div>

      <Collapse in={isOpen} keepMounted>
        <ul className="px-2 pt-1.5 pb-3">
          {loc?.items?.map((item) => {
            const next = { ...item, depth: 1 };
            return (
              <SidebarItemCard item={next} key={`sidebar-item-${item.id}`} />
            );
          })}

          {unflattened?.map((container) => (
            <ContainerAccordion
              container={container}
              key={`sidebar-con-${container.id}`}
            />
          ))}
        </ul>
      </Collapse>
    </li>
  );
};

export default LocationAccordion;
