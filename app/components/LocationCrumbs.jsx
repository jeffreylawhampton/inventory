import { Anchor, Breadcrumbs } from "@mantine/core";
import {
  IconChevronRight,
  IconBox,
  IconMapPin,
  IconClipboardList,
} from "@tabler/icons-react";
import { breadcrumbStyles } from "../lib/styles";
import IconPill from "./IconPill";

const LocationCrumbs = ({ ancestors, location, name, type }) => {
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
            icon={
              <IconBox
                aria-label="Container"
                size={breadcrumbStyles.iconSize}
              />
            }
            name={ancestor?.name}
            labelClasses={breadcrumbStyles.textSize}
            padding={breadcrumbStyles.padding}
          />
        </Anchor>
      );
    });
  }

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
            icon={
              <IconMapPin
                aria-label="Location"
                size={breadcrumbStyles.iconSize}
              />
            }
            name={location?.name}
            labelClasses={breadcrumbStyles.textSize}
            padding={breadcrumbStyles.padding}
          />
        </Anchor>
      ) : null}
      {breadcrumbItems}
      <span className={breadcrumbStyles.textSize}>
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
