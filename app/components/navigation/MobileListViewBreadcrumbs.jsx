import { Popover } from "@mantine/core";
import { BreadcrumbTrail } from "..";
import { MapPin } from "lucide-react";
import { useContext } from "react";
import { ModalContext } from "@/app/providers";

export default function MobileListViewBreadcrumbs({ data }) {
  const { activePopoverId, setActivePopoverId } = useContext(ModalContext);

  const opened = activePopoverId === data?.id + "-location";
  const setOpened = () =>
    setActivePopoverId(opened ? null : data?.id + "-location");
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
      closeOnClickOutside
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <button
          onClick={setOpened}
          className={`relative rounded h-8 px-2 !flex !items-center text-center ${
            data?.location || data?.container || data?.parentContainer
              ? "hover:brightness-75"
              : "opacity-50"
          }`}
        >
          <MapPin
            size={26}
            fill="var(--mantine-color-primary-5)"
            className="[&>circle]:fill-white !px-auto shrink-0"
          />
        </button>
      </Popover.Target>

      <Popover.Dropdown>
        <BreadcrumbTrail data={data} showAll={true} />
      </Popover.Dropdown>
    </Popover>
  );
}
