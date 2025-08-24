import { useContext } from "react";
import { DeviceContext } from "@/app/providers";
import { DesktopListViewBreadcrumbs, MobileListViewBreadcrumbs } from "..";
import { MapPin } from "lucide-react";

export default function ListViewBreadcrumbs({ data, isLocation }) {
  const { width, showDelete } = useContext(DeviceContext);
  const pillClasses = `${
    showDelete
      ? "bg-white/30"
      : "bg-bluegray-200 hover:bg-bluegray-300 active:bg-bluegray-400/90"
  } cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 !text-black text-[10px] !font-semibold`;
  if (!data?.location && !data?.container && !data?.parentContainer) {
    return (
      <div
        className={`${pillClasses} hover:!bg-bluegray-300/70 active:!bg-bluegray-300/70`}
      >
        <MapPin size={12} />
        <span>—</span>
      </div>
    );
  }

  return width < 640 ? (
    <MobileListViewBreadcrumbs
      data={data}
      pillClasses={pillClasses}
      isLocation={isLocation}
    />
  ) : (
    <DesktopListViewBreadcrumbs
      data={data}
      pillClasses={pillClasses}
      isLocation={isLocation}
    />
  );
}
