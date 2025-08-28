import { ScrollArea } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import LocationAccordion from "./sidebar/LocationAccordion";
import { animateResize } from "./handlers";

const LocationsSidebar = ({ sidebarSize, locations, panel, isMobile }) => {
  const button =
    sidebarSize > 60 ? (
      <button
        className={`absolute z-[100] rounded-lg [&>svg]:text-bluegray-600  ${
          isMobile
            ? "bottom-1 left-[46%] [&>svg]:rotate-[-90deg] p-1"
            : "top-[45%] right-1 rotate-180 active:bg-bluegray-100"
        }`}
        onClick={() => animateResize(sidebarSize, 0, panel)}
      >
        <ChevronRight size={isMobile ? 34 : 30} aria-label="Collapse sidebar" />
      </button>
    ) : null;

  return (
    <>
      {button}
      <ScrollArea
        h={isMobile ? "100%" : "100vh"}
        type="scroll"
        scrollbars="xy"
        classNames={{
          root: `relative ${
            isMobile ? "w-full h-full" : "w-full h-screen py-5"
          }`,
          scrollbar: `
          ${
            isMobile
              ? "!bottom-2 z-100 absolute data-[orientation=horizontal]:!h-[8px] data-[orientation=vertical]:!w-[8px] !bg-slate-100"
              : ""
          }`,
        }}
      >
        <ul className="list-none">
          {locations?.map((location) => {
            return (
              <LocationAccordion key={location?.name} location={location} />
            );
          })}
        </ul>
        {isMobile ? <div className="h-8" /> : null}
      </ScrollArea>
    </>
  );
};
export default LocationsSidebar;
