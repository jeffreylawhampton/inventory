import { Popover } from "@mantine/core";
import { CategoryPill } from ".";
import { useContext } from "react";
import { ModalContext } from "../providers";
import { Tag } from "lucide-react";

export default function CategoryPopup({ item }) {
  const { activePopoverId, setActivePopoverId } = useContext(ModalContext);
  const opened = activePopoverId === item.id + "-tags";
  const setOpened = () => setActivePopoverId(opened ? null : item.id + "-tags");

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
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <button
          onClick={item?.categories?.length ? setOpened : null}
          className="relative rounded h-full min-h-[32px] px-2 flex !items-center text-center [&>svg]:fill-primary-700 hover:brightness-75"
        >
          <Tag
            size={25}
            fill="var(--mantine-color-primary-6)"
            stroke="black"
            className="relative left-1"
          />
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
