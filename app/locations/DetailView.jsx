import { Header } from "../components";
import { ChevronRight } from "lucide-react";
import { animateResize } from "./handlers";

const DetailView = ({
  handleCancelDelete,
  isMobile,
  sidebarSize,
  panel,
  pageData,
  showDelete,
  children,
}) => {
  return (
    <div className="relative w-full h-full px-4 pb-8 overflow-y-auto">
      <div
        className={`w-full h-full absolute top-0 left-0  transition-all duration-300 ${
          showDelete ? "z-[1000] bg-black/40" : "z-[-1]"
        }`}
        onClick={handleCancelDelete}
      />
      <Header pageData={pageData} classes="sticky top-0 bg-white py-3 z-50" />
      {(isMobile && sidebarSize < 60) || (!isMobile && sidebarSize < 10) ? (
        <button
          className={`${
            isMobile ? "fixed z-[60]" : "absolute"
          } rounded-lg [&>svg]:text-bluegray-800  ${
            isMobile
              ? `mt-[-55px] left-[46%] p-1 pt-0 ${
                  sidebarSize < 20 ? "[&>svg]:rotate-90" : "rotate-[-90deg]"
                }`
              : "flex items-center justify-center bottom-10 left-6 bg-bluegray-300 w-10 h-10 !rounded-full text-white active:bg-bluegray-100"
          }`}
          onClick={() =>
            animateResize(sidebarSize, sidebarSize < 20 ? 30 : 0, panel)
          }
        >
          <ChevronRight
            color="var(--mantine-color-bluegray-7)"
            size={isMobile ? 34 : 30}
            aria-label="Expand sidebar"
            strokeWidth={3}
          />
        </button>
      ) : null}
      {children}
    </div>
  );
};

export default DetailView;
