import { Popover } from "@mantine/core";
import { BreadcrumbTrail, ColorPill } from "..";
import { MapPin } from "lucide-react";

export default function MobileListViewBreadcrumbs({
  data,
  isLocation = false,
  pillClasses,
}) {
  return (
    <Popover
      position="top"
      classNames={{ dropdown: "w-max !max-w-[95vw]" }}
      shadow="0px 4px 8px #00000044"
      radius="xl"
      withArrow
      arrowSize={12}
      offset={8}
      closeOnEscape
    >
      <Popover.Target>
        {data?.location ? (
          <button
            onClick={() =>
              router.push(`/locations?type=location&id=${data?.location?.id}`)
            }
            className={pillClasses}
          >
            <MapPin size={12} />
            <span>{data?.location?.name}</span>
          </button>
        ) : (
          <span className="!min-w-fit">
            <ColorPill
              container={data?.parentContainer ?? data?.container}
              isLocation={isLocation}
              navigate={false}
            />
          </span>
        )}
      </Popover.Target>
      <Popover.Dropdown>
        <BreadcrumbTrail data={data} showAll={true} />
      </Popover.Dropdown>
    </Popover>
  );
}
