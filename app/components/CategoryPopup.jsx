import { Popover } from "@mantine/core";
import { CategoryPill } from ".";
import { CategoryIcon } from "../assets";

export default function CategoryPopup({ item }) {
  const disabled = !item?.categories?.length;
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
      disabled={disabled}
    >
      <Popover.Target>
        <button
          className={`relative rounded bg-bluegray-100 h-full min-h-[32px] px-1.5 flex !items-center text-center [&>svg]:fill-primary-400  ${
            disabled ? "opacity-50" : "hover:brightness-75"
          }`}
        >
          <CategoryIcon width={18} height={18} strokeWidth={6} />
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
