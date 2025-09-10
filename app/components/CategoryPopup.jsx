import { useState } from "react";
import { Tooltip } from "@mantine/core";
import { CategoryPill } from ".";
import { Tag } from "lucide-react";

export default function CategoryPopup({ item }) {
  const [opened, setOpened] = useState(false);
  const disabled = !item?.categories?.length;

  const label = (
    <div className="flex flex-wrap-none gap-1 items-center">
      {item?.categories?.map((category) => (
        <CategoryPill category={category} key={category.name} showTag />
      ))}
    </div>
  );
  return (
    <Tooltip
      label={label}
      withArrow
      opened={opened}
      events={{ hover: true, focus: true, touch: true }}
      classNames={{ tooltip: "!bg-white !px-2 !py-1 dropshadow !rounded-full" }}
    >
      <button
        disabled={disabled}
        onClick={setOpened}
        className="disabled:opacity-50 relative rounded h-full min-h-[32px] px-2 flex !items-center text-center [&>svg]:fill-primary-700 hover:brightness-75"
      >
        <Tag
          size={25}
          fill="var(--mantine-color-primary-6)"
          stroke="black"
          className="relative left-1"
        />
      </button>
    </Tooltip>
  );
}
