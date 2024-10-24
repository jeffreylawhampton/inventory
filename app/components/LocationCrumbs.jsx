import { useContext } from "react";
import { Anchor, Breadcrumbs } from "@mantine/core";
import {
  IconChevronRight,
  IconBox,
  IconMapPin,
  IconClipboardList,
} from "@tabler/icons-react";
import { breadcrumbStyles } from "../lib/styles";
import { DeviceContext } from "../layout";
import IconPill from "./IconPill";

const LocationCrumbs = ({ ancestors, location, name, type }) => {
  const { isMobile } = useContext(DeviceContext);
  let breadcrumbItems;
  if (ancestors?.length) {
    breadcrumbItems = ancestors?.map((ancestor) => {
      return (
        <Anchor
          key={ancestor?.name}
          href={`/containers/${ancestor?.id}`}
          classNames={{ root: "!no-underline" }}
        >
          <IconPill
            icon={<IconBox aria-label="Container" size={18} />}
            name={ancestor?.name}
          />
        </Anchor>
      );
    });
  }

  if (isMobile && breadcrumbItems?.length > 2)
    breadcrumbItems = [
      "...",
      breadcrumbItems[breadcrumbItems.length - 1],
      breadcrumbItems[breadcrumbItems.length],
    ];

  return (
    <Breadcrumbs
      separatorMargin={6}
      separator={
        <IconChevronRight
          size={breadcrumbStyles.separatorSize}
          className={breadcrumbStyles.separatorClasses}
          strokeWidth={breadcrumbStyles.separatorStroke}
          separatorMargin={breadcrumbStyles.separatorMargin}
        />
      }
      classNames={breadcrumbStyles.breadCrumbClasses}
    >
      {location?.id ? (
        <Anchor
          href={`/locations/${location?.id}`}
          classNames={{ root: "!no-underline" }}
        >
          <IconPill
            icon={<IconMapPin aria-label="Location" size={18} />}
            name={location?.name}
          />
        </Anchor>
      ) : null}
      {breadcrumbItems}
      <span>
        {type === "container" ? (
          <IconBox size={breadcrumbStyles.iconSize} aria-label="Container" />
        ) : (
          <IconClipboardList
            size={breadcrumbStyles.iconSize}
            aria-label="Item"
          />
        )}
        {name}
      </span>
    </Breadcrumbs>
  );
};

export default LocationCrumbs;
