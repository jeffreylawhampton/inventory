import { useContext } from "react";
import { DeviceContext, ModalContext } from "@/app/providers";
import { DesktopListViewBreadcrumbs, MobileListViewBreadcrumbs } from "..";

export default function ListViewBreadcrumbs({ data, isLocation }) {
  const { width } = useContext(DeviceContext);
  const { showDelete } = useContext(ModalContext);
  const pillClasses = `${
    showDelete
      ? "bg-white/30"
      : "bg-bluegray-200 hover:bg-bluegray-300 active:bg-bluegray-400/90"
  } cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 !text-black text-[10px] !font-semibold`;

  return width < 700 ? (
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
