import { Popover } from "@mantine/core";
import { CategoryPill } from ".";
import { CategoryIcon } from "../assets";
import { useContext } from "react";
import { DeviceContext } from "../providers";

export default function CategoryPopup({ item }) {
  const disabled = !item?.categories?.length;
  const { activePopoverId, setActivePopoverId } = useContext(DeviceContext);
  const opened = activePopoverId === item?.id + "-categories";
  const setOpened = () =>
    setActivePopoverId(opened ? null : item?.id + "-categories");
  return (
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
      closeOnClickOutside
      disabled={disabled}
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <button
          onClick={setOpened}
          className={`relative rounded h-full min-h-[32px] px-1.5 flex !items-center text-center [&>svg]:fill-primary-700 ${
            disabled ? "opacity-30" : "hover:brightness-75"
          }`}
        >
          <CategoryIcon width={24} height={24} strokeWidth={6} />
        </button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-wrap-none gap-1 items-center">
          {item?.categories?.map((category) => (
            <CategoryPill category={category} key={category.name} showTag />
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
