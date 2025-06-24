import LucideIcon from "./LucideIcon";
import CategoryPill from "./CategoryPill";
import { Box, ChevronRight, Heart, MapPin } from "lucide-react";
import { v4 } from "uuid";

const HoverItem = ({ item, showLocation }) => {
  const pillClasses =
    "flex gap-[3px] text-[11px] items-center bg-bluegray-200 rounded-full pl-2 pr-2.5 py-[3px] font-medium";

  return (
    <div className="flex gap-1 items-center">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 font-semibold leading-tight hyphens-auto text-pretty !break-words mb-0 pl-0.5">
          <LucideIcon iconName={item?.icon ?? "Layers"} size={20} />{" "}
          {item?.name}
          {item?.favorite ? (
            <Heart
              size={16}
              fill="var(--mantine-color-danger-3)"
              stroke="transparent"
            />
          ) : null}
        </h2>

        {item?.categories?.length ? (
          <div className="flex gap-1 flex-wrap">
            {item.categories?.map((category) => {
              return (
                <CategoryPill
                  key={v4()}
                  category={category}
                  size="xs"
                  link={false}
                />
              );
            })}
          </div>
        ) : null}

        {showLocation ? (
          <div className="flex flex-wrap items-center gap-[2px]">
            {item?.location?.name ? (
              <div className={pillClasses}>
                <MapPin size={12} strokeWidth={2.5} />
                {item.location.name}
              </div>
            ) : null}
            {item?.location?.name && item?.container?.name ? (
              <ChevronRight size={13} />
            ) : null}
            {item?.container?.name ? (
              <div className={pillClasses}>
                <Box size={11} strokeWidth={2.5} />
                {item.container.name}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HoverItem;
