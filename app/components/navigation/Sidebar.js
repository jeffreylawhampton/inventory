"use client";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import SidebarSearch from "./SidebarSearch";
import {
  CategoryIcon,
  ContainerIcon,
  ItemsIcon,
  LocationIcon,
} from "@/app/assets";

const Sidebar = () => {
  const pathname = usePathname()?.substring(1);

  return (
    <div
      className={`bg-slate-100 z-40 shadow-lg px-4 pt-16 text-nowrap flex flex-col gap-14 items-center min-h-screen h-full fixed w-[60px]`}
    >
      <NavItem
        url="/locations"
        label="Locations"
        isSelected={pathname === "locations"}
        className="sidebar-icon"
      >
        <LocationIcon
          width={28}
          aria-label="Location"
          strokeWidth={6}
          isSelected={pathname?.includes("locations")}
        />
      </NavItem>

      <NavItem
        url="/containers"
        label="Containers"
        isSelected={pathname.includes("containers")}
        className="sidebar-icon"
      >
        <ContainerIcon
          width={32}
          aria-label="Container"
          isSelected={pathname.includes("containers")}
          strokeWidth={4}
        />
      </NavItem>

      <NavItem
        url="/categories"
        label="Categories"
        isSelected={pathname.includes("categories")}
        className="sidebar-icon"
      >
        <CategoryIcon
          width={32}
          isSelected={pathname.includes("categories")}
          aria-label="Category"
          strokeWidth={6}
        />
      </NavItem>

      <NavItem
        url="/items"
        label="Items"
        isSelected={pathname.includes("items")}
        className="sidebar-icon"
      >
        <ItemsIcon
          width={28}
          isSelected={pathname.includes("items")}
          aria-label="Item"
          strokeWidth={8}
        />
      </NavItem>
      <SidebarSearch />
    </div>
  );
};

export default Sidebar;
