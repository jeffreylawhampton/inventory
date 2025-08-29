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
    <div className="relative w-full h-full px-4 lg:px-8 pb-8 pt-0 overflow-y-auto">
      <div
        className={`w-full h-full absolute top-0 left-0  transition-all duration-300 ${
          showDelete ? "z-[1000] bg-black/40" : "z-[-1]"
        }`}
        onClick={handleCancelDelete}
      />
      <Header
        pageData={pageData}
        classes="sticky top-0 bg-white pb-3 pt-2 z-50"
      />
      {(isMobile && sidebarSize < 60) || (!isMobile && sidebarSize < 5) ? (
        <button
          className={`${
            isMobile ? "fixed z-[60]" : "absolute"
          } rounded-lg [&>svg]:text-bluegray-800  ${
            isMobile
              ? `mt-[-50px] left-[46%] p-1 ${
                  sidebarSize < 20 ? "[&>svg]:rotate-90" : "rotate-[-90deg]"
                }`
              : "top-[45%] left-1 active:bg-bluegray-100"
          }`}
          onClick={() =>
            animateResize(sidebarSize, sidebarSize < 20 ? 30 : 0, panel)
          }
        >
          <ChevronRight
            color="var(--mantine-color-bluegray-6)"
            size={isMobile ? 34 : 30}
            aria-label="Expand sidebar"
          />
        </button>
      ) : null}
      {children}
    </div>
  );
};

export default DetailView;
