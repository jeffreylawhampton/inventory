import { Popover } from "@mantine/core";
import { BreadcrumbTrail } from "..";
import { MapPin } from "lucide-react";

export default function MobileListViewBreadcrumbs({ data }) {
  return (
    <Popover
      position="top"
      classNames={{ dropdown: "w-max !max-w-[95vw] !py-1.5 !px-2.5" }}
      shadow="0px 4px 8px #00000044"
      radius="xl"
      withArrow
      arrowSize={12}
      offset={8}
      closeOnEscape
    >
      <Popover.Target>
        <button
          className={`relative rounded bg-bluegray-100 h-8 w-8 px-1.5 !flex !items-center text-center ${
            data?.location || data?.container || data?.parentContainer
              ? "hover:brightness-75"
              : "opacity-50"
          }`}
        >
          <MapPin
            size={18}
            fill="var(--mantine-color-primary-3)"
            className="[&>circle]:fill-white !px-auto"
          />
        </button>
      </Popover.Target>

      <Popover.Dropdown>
        <BreadcrumbTrail data={data} showAll={true} />
      </Popover.Dropdown>
    </Popover>
  );
}
