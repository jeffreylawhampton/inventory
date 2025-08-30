import { useState } from "react";
import { Tooltip } from "@mantine/core";
import { BreadcrumbTrail } from "..";
import { MapPin } from "lucide-react";

export default function MobileListViewBreadcrumbs({ data }) {
  const [opened, setOpened] = useState(false);

  return (
    <Tooltip
      position="top"
      withArrow
      label={<BreadcrumbTrail data={data} showAll={true} />}
      opened={opened}
      events={{ hover: true, focus: true, touch: true }}
      classNames={{
        tooltip: "!bg-white !px-2 !py-1 dropshadow !rounded-full",
      }}
    >
      <button
        onClick={setOpened}
        className="relative rounded h-full min-h-[32px] px-2 flex !items-center text-center [&>svg]:fill-primary-700 hover:brightness-75"
      >
        <MapPin
          size={26}
          fill="var(--mantine-color-primary-5)"
          className="[&>circle]:fill-white !px-auto shrink-0"
        />
      </button>
    </Tooltip>
  );
}
