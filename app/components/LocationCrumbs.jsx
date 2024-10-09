import { useContext } from "react";
import { Anchor, Breadcrumbs } from "@mantine/core";
import { IconChevronRight, IconBox, IconMapPin } from "@tabler/icons-react";
import { breadcrumbStyles } from "../lib/styles";
import { DeviceContext } from "../layout";

const LocationCrumbs = ({ ancestors, location, name, type }) => {
  const { isMobile } = useContext(DeviceContext);
  let breadcrumbItems;
  if (ancestors?.length) {
    breadcrumbItems = ancestors?.map((ancestor) => {
      return (
        <Anchor key={ancestor?.name} href={`/containers/${ancestor?.id}`}>
          <IconBox
            size={breadcrumbStyles.iconSize}
            aria-label="Box"
            className={breadcrumbStyles.iconColor}
          />
          {ancestor?.name}
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
        />
      }
      classNames={breadcrumbStyles.breadCrumbClasses}
    >
      {location?.id ? (
        <Anchor href={`/locations/${location?.id}`}>
          <IconMapPin
            size={breadcrumbStyles.iconSize}
            aria-label="Location"
            className={breadcrumbStyles.iconColor}
          />
          {location?.name}
        </Anchor>
      ) : null}
      {breadcrumbItems}
      <span>
        {type === "container" ? (
          <IconBox size={breadcrumbStyles.iconSize} aria-label="Container" />
        ) : null}
        {name}
      </span>
    </Breadcrumbs>
  );
};

export default LocationCrumbs;
