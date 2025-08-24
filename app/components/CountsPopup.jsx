import { Popover } from "@mantine/core";
import { ListPill } from ".";
import { Calculator } from "lucide-react";

export default function CountsPopup({
  itemCount,
  containerCount,
  showPopup = false,
}) {
  const disabled = !itemCount && !containerCount;
  const pills = (
    <div className="flex gap-1 items-center justify-end">
      <ListPill count={containerCount} type="container" />
      <ListPill count={itemCount} type="item" />
    </div>
  );
  return showPopup ? (
    <Popover
      position="top"
      classNames={{
        dropdown: "w-max !max-w-[95vw] !py-1.5 !px-2.5",
      }}
      shadow="0px 4px 8px #00000044"
      radius="xl"
      withArrow
      arrowSize={12}
      offset={4}
      closeOnEscape
      disabled={disabled}
    >
      <Popover.Target>
        <button
          className={`relative rounded h-full min-h-[32px] px-1.5 flex !items-center text-center [&>svg]:fill-primary-700 ${
            disabled ? "opacity-30" : "hover:brightness-75"
          }`}
        >
          <Calculator
            size={23}
            fill="var(--mantine-color-primary-6)"
            stroke="black"
            strokeWidth={1}
          />
        </button>
      </Popover.Target>
      <Popover.Dropdown>{pills}</Popover.Dropdown>
    </Popover>
  ) : (
    <div className="flex gap-1 items-center justify-end">
      <ListPill count={containerCount} type="container" />
      <ListPill count={itemCount} type="item" />
    </div>
  );
}
