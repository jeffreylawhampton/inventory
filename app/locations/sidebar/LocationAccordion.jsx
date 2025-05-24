import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import {
  IconChevronRight,
  IconBox,
  IconClipboardList,
} from "@tabler/icons-react";
import ContainerAccordion from "./ContainerAccordion";
import { sortObjectArray, buildContainerTree } from "../../lib/helpers";
import { LocationContext } from "../layout";
import DraggableItem from "./SidebarItem";
import DeleteSelector from "../DeleteSelector";
import { DeviceContext } from "@/app/layout";

const LocationAccordion = ({ location }) => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");
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
    id: location.id,
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
  const isSelected = type === "location" && id == location.id;
  const isSelectedForDeletion = selectedForDeletion?.find(
    (i) => i.name === location.name
  );

  return (
    <li
      className={`${
        isMobile ? "mx-1" : "mx-2"
      } my-1 font-semibold text-[15px] relative `}
    >
      {hasContents ? (
        <button
          onClick={() => handleLocationClick(location.id)}
          className={`absolute z-20 peer group rounded ${
            isSelected ? "hover:bg-primary-300" : "hover:bg-primary-200/70"
          } ${
            showDelete
              ? isSelectedForDeletion
                ? "hover:bg-danger-300/70"
                : ""
              : ""
          } ${isMobile ? "p-1 top-1.5 left-1" : "p-0.5 top-2 left-2"}`}
        >
          <IconChevronRight
            aria-label={isOpen ? "Collapse location" : "Expand location"}
            size={isMobile ? 20 : 16}
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
        className={`p-1.5 ${
          isMobile ? "py-2 pl-9" : "pl-9"
        } rounded cursor-pointer group flex ${
          isOver
            ? "bg-primary-500"
            : showDelete
            ? isSelectedForDeletion
              ? "bg-danger-200/80"
              : "opacity-60 hover:bg-danger-200/30"
            : isSelected
            ? "bg-primary-200"
            : "hover:bg-primary-100 peer-hover:bg-primary-100"
        }`}
        onPointerDown={
          showDelete
            ? () => handleSelectForDeletion(location)
            : () => router.push(`?type=location&id=${location.id}`)
        }
        onKeyDown={(e) =>
          e.key === "Enter"
            ? router.push(`?type=location&id=${location.id}`)
            : null
        }
      >
        <div className="flex justify-start gap-5 w-full h-full">
          <h3 className="text-nowrap">{location.name}</h3>

          <div className="flex gap-3 text-sm ">
            {location._count?.containers ? (
              <div className={`flex gap-[3px] items-center px-1`}>
                <IconBox size={16} aria-label="Container count" />
                {location._count?.containers}
              </div>
            ) : null}
            {location._count?.items ? (
              <div className={`flex gap-[3px] items-center px-1`}>
                <IconClipboardList size={16} aria-label="Item count" />
                {location._count?.items}
              </div>
            ) : null}
          </div>
        </div>
        {showDelete ? (
          <DeleteSelector isSelectedForDeletion={isSelectedForDeletion} />
        ) : null}
      </div>

      <Collapse in={openLocations?.includes(location.name)}>
        <ul>
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
