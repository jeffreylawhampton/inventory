import { useState } from "react";
import { Tooltip } from "@mantine/core";
import { ListPill } from ".";
import { Calculator } from "lucide-react";

export default function CountsPopup({
  itemCount,
  containerCount,
  showPopup = false,
}) {
  const [opened, setOpened] = useState(false);
  const pills = (
    <div className="flex gap-1 items-center justify-end text-black">
      <ListPill count={containerCount} type="container" />
      <ListPill count={itemCount} type="item" />
    </div>
  );

  return showPopup ? (
    <Tooltip
      position="top"
      label={pills}
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
        <Calculator
          size={25}
          fill="var(--mantine-color-primary-6)"
          stroke="black"
          strokeWidth={1}
        />
      </button>
    </Tooltip>
  ) : (
    <div className="flex gap-1 items-center justify-end">
      <ListPill count={containerCount} type="container" />
      <ListPill count={itemCount} type="item" />
    </div>
  );
}
