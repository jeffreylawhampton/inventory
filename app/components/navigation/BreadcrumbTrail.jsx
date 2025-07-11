import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@mantine/core";
import { ColorPill } from "..";
import { v4 } from "uuid";
import { breadcrumbStyles } from "@/app/lib/styles";
import { DeviceContext } from "../../providers";
import { Ellipsis, MapPin, ChevronRight } from "lucide-react";

export default function BreadcrumbTrail({ data, isLocation = false }) {
  const { isMobile } = useContext(DeviceContext);
  const [showTrail, setShowTrail] = useState(!isMobile);
  const router = useRouter();

  useEffect(() => {
    setShowTrail(!isMobile);
  }, [data?.id, isMobile]);

  const pillClasses = `bg-bluegray-300/70 hover:bg-bluegray-300 active:bg-bluegray-400/90 cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 !text-black text-[10px] !font-semibold`;
  const ancestors = [];
  const getAncestors = (container) => {
    if (container?.parentContainer?.id) {
      ancestors.unshift(container.parentContainer);
      getAncestors(container.parentContainer);
    }
  };

  if (data?.type === "container") {
    getAncestors(data);
  }
  if (data?.type === "item") {
    const newData = { ...data, parentContainer: data?.container };
    getAncestors(newData);
  }

  const breadcrumbItems = ancestors.map((ancestor) => (
    <ColorPill key={v4()} container={{ ...ancestor }} isLocation={isLocation} />
  ));

  const locationButton = data?.location?.id ? (
    <button
      onClick={() =>
        router.push(`/locations?type=location&id=${data?.location?.id}`)
      }
      className={pillClasses}
    >
      <MapPin size={12} />
      <span>{data?.location?.name}</span>
    </button>
  ) : null;

  return data?.type ? (
    <Breadcrumbs
      separatorMargin="0px"
      separator={
        <ChevronRight
          size={breadcrumbStyles.separatorSize}
          className={breadcrumbStyles.separatorClasses}
          strokeWidth={breadcrumbStyles.separatorStroke}
        />
      }
      classNames={breadcrumbStyles.breadCrumbClasses}
    >
      {data?.type != "location" ? locationButton : null}
      {showTrail ? (
        breadcrumbItems
      ) : breadcrumbItems?.length > 1 ? (
        <button onClick={() => setShowTrail(true)}>
          <Ellipsis
            className="text-primary-600"
            aria-label="Expand breadcrumbs"
            size={24}
          />
        </button>
      ) : null}
      {!showTrail ? breadcrumbItems[breadcrumbItems?.length - 1] : null}
    </Breadcrumbs>
  ) : null;
}
