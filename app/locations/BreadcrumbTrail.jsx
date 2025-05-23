import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
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

export default function BreadcrumbTrail({ data }) {
  const { isMobile } = useContext(DeviceContext);
  const [showTrail, setShowTrail] = useState(!isMobile);
  const router = useRouter();

  useEffect(() => {
    setShowTrail(!isMobile);
  }, [data?.id, isMobile]);

  const pillClasses = `bg-bluegray-300/70 hover:bg-bluegray-300 active:bg-bluegray-400/90 cursor-pointer rounded-full flex items-center gap-[3px] py-1 pr-3 pl-2.5 !text-black text-xs !font-semibold`;
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
    <ColorPill key={v4()} container={{ ...ancestor }} />
  ));

  const allLocationsButton = (
    <button onClick={() => router.push(`/locations`)} className={pillClasses}>
      <IconMapPins size={18} />
      <span>All locations</span>
    </button>
  );

  const locationButton = data?.location?.id ? (
    <button
      onClick={() => router.push(`?type=location&id=${data?.location?.id}`)}
      className={pillClasses}
    >
      <IconMapPin size={18} />
      <span>{data?.location?.name}</span>
    </button>
  ) : null;

  const currentItem = (
    <span className="text-[14px] !font-semibold">
      {data?.type === "location" ? (
        <IconMapPin
          size={18}
          aria-label="Location"
          className="mr-[1px] mt-[-2px]"
        />
      ) : data?.type === "container" ? (
        <IconBox
          size={18}
          aria-label="Container"
          className="mr-[1px] mt-[-2px]"
          fill={data?.color?.hex || "none"}
        />
      ) : (
        <IconClipboardList
          size={18}
          aria-label="Item"
          className="mr-[1px] mt-[-2px]"
          fill="var(--mantine-color-primary-1)"
        />
      )}
      {data?.name}
    </span>
  );

  return data?.type ? (
    <Breadcrumbs
      separatorMargin={6}
      separator={
        <IconChevronRight
          size={breadcrumbStyles.separatorSize}
          className={breadcrumbStyles.separatorClasses}
          strokeWidth={breadcrumbStyles.separatorStroke}
        />
      }
      classNames={breadcrumbStyles.breadCrumbClasses}
    >
      {allLocationsButton}
      {data?.type != "location" ? locationButton : null}
      {showTrail ? (
        breadcrumbItems
      ) : breadcrumbItems?.length ? (
        <button onClick={() => setShowTrail(true)}>
          <IconDots
            className="text-primary-600"
            aria-label="Expand breadcrumbs"
            size={28}
          />
        </button>
      ) : null}

      {currentItem}
    </Breadcrumbs>
  ) : null;
}
