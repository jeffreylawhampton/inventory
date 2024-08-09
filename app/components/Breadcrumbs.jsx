"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Breadcrumbs as Crumbs, BreadcrumbItem } from "@nextui-org/react";

const Breadcrumbs = () => {
  const paths = usePathname();
  const pathNames = paths.split("/")[1];
  const params = useSearchParams();
  const name = params.get("name");

  return (
    <Crumbs size="lg" className="pb-6">
      {pathNames && <BreadcrumbItem href="/">Home</BreadcrumbItem>}
      {pathNames && (
        <BreadcrumbItem
          href={`/${pathNames}`}
          className={name ? "" : "font-medium"}
        >
          {pathNames[0].toUpperCase() + pathNames.slice(1, pathNames.length)}
        </BreadcrumbItem>
      )}
      {name && (
        <BreadcrumbItem
          className="font-medium"
          href={`/${pathNames}/${pathNames[1]}`}
        >
          {name}
        </BreadcrumbItem>
      )}
    </Crumbs>
  );
};

export default Breadcrumbs;
