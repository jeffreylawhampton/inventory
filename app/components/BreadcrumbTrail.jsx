import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@mantine/core";
import {
  IconDots,
  IconMapPins,
  IconMapPin,
  IconBox,
  IconClipboardList,
  IconChevronRight,
} from "@tabler/icons-react";
import { ColorPill } from "../components";
import { v4 } from "uuid";
import { breadcrumbStyles } from "../lib/styles";
import { DeviceContext } from "../layout";

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
      <IconMapPin size={14} />
      <span>{data?.location?.name}</span>
    </button>
  ) : null;

  return data?.type ? (
    <Breadcrumbs
      separatorMargin="0px"
      separator={
        <IconChevronRight
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
          <IconDots
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
