import { useContext } from "react";
import { DeviceContext } from "@/app/providers";
import { DesktopListViewBreadcrumbs, MobileListViewBreadcrumbs } from "..";

export default function ListViewBreadcrumbs({ data, isLocation }) {
  const { isMobile } = useContext(DeviceContext);

  const pillClasses = `bg-bluegray-300/70 hover:bg-bluegray-300 active:bg-bluegray-400/90 cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 !text-black text-[10px] !font-semibold`;

  if (
    !data?.type ||
    (!data?.location && !data?.container && !data?.parentContainer)
  )
    return;

  return isMobile ? (
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
