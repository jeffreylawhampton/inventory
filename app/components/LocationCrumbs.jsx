import { Anchor, Breadcrumbs } from "@mantine/core";
import { IconChevronRight, IconBox, IconMapPin } from "@tabler/icons-react";
import { breadcrumbStyles } from "../lib/styles";

const LocationCrumbs = ({ ancestors, location, name }) => {
  const breadcrumbItems = ancestors?.map((ancestor) => {
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
      <Anchor href={`/locations/${location?.id}`}>
        <IconMapPin
          size={breadcrumbStyles.iconSize}
          aria-label="Location"
          className={breadcrumbStyles.iconColor}
        />
        {location?.name}
      </Anchor>
      {breadcrumbItems}
      <span>{name}</span>
    </Breadcrumbs>
  );
};

export default LocationCrumbs;
