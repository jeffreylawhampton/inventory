import { useRouter } from "next/navigation";
import { Breadcrumbs, Popover } from "@mantine/core";
import { BreadcrumbTrail, ColorPill } from "..";
import { breadcrumbStyles } from "@/app/lib/styles";
import { Ellipsis, MapPin, ChevronRight } from "lucide-react";

export default function DesktopListViewBreadcrumbs({
  data,
  pillClasses,
  isLocation,
}) {
  const router = useRouter();

  const parent =
    data?.type === "item" ? data?.container : data?.parentContainer;

  return (
    <Breadcrumbs
      separatorMargin="0px"
      separator={
        <ChevronRight
          size={breadcrumbStyles.separatorSize}
          className={breadcrumbStyles.separatorClasses}
          strokeWidth={breadcrumbStyles.separatorStroke}
        />
      }
      classNames={{ separator: "!mx-[2px]" }}
    >
      {data?.location ? (
        <button
          onClick={() =>
            router.push(`/locations?type=location&id=${data?.location?.id}`)
          }
          className={pillClasses}
        >
          <MapPin size={12} />
          <span>{data?.location?.name}</span>
        </button>
      ) : parent && parent?.parentContainer ? (
        <ColorPill
          container={parent?.parentContainer}
          isLocation={isLocation}
        />
      ) : null}

      {(data?.location && parent && parent?.parentContainer) ||
      (parent &&
        parent?.parentContainer &&
        parent?.parentContainer?.parentContainer) ? (
        <Popover
          position="top"
          classNames={{
            dropdown: "w-max !py-1.5 !px-2.5",
          }}
          shadow="0px 4px 8px #00000044"
          radius="xl"
          withArrow
          arrowSize={10}
          offset={0}
          closeOnEscape
          closeOnClickOutside
        >
          <Popover.Target>
            <button>
              <Ellipsis
                className="text-primary-600"
                aria-label="Expand breadcrumbs"
                size={16}
              />
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <BreadcrumbTrail data={data} showAll={true} />
          </Popover.Dropdown>
        </Popover>
      ) : null}

      {parent ? (
        <ColorPill container={parent} isLocation={false} navigate={false} />
      ) : null}
    </Breadcrumbs>
  );
}
