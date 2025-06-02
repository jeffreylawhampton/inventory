"use client";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import {
  CategoryIcon,
  ContainerIcon,
  HomeIcon,
  ItemIcon,
  LocationIcon,
} from "../assets";

const Sidebar = () => {
  const pathname = usePathname()?.substring(1);

  return (
    <div
      className={`bg-slate-100 z-40 shadow-lg px-4 pt-10 text-nowrap flex flex-col gap-12 items-center min-h-screen h-full fixed w-[60px]`}
    >
      <NavItem url="/" label="Home" isSelected={!pathname}>
        <HomeIcon
          width={32}
          aria-label="Home"
          strokeWidth={7}
          className="sidebar-icon"
          isSelected={!pathname}
        />
      </NavItem>

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
        isSelected={pathname === "containers"}
        className="sidebar-icon"
      >
        <ContainerIcon
          width={32}
          aria-label="Container"
          isSelected={pathname === "containers"}
          strokeWidth={4}
        />
      </NavItem>

      <NavItem
        url="/categories"
        label="Categories"
        isSelected={pathname === "categories"}
        className="sidebar-icon"
      >
        <CategoryIcon
          width={32}
          isSelected={pathname === "categories"}
          aria-label="Category"
          strokeWidth={6}
        />
      </NavItem>

      <NavItem
        url="/items"
        label="Items"
        isSelected={pathname === "items"}
        className="sidebar-icon"
      >
        <ItemIcon
          width={28}
          isSelected={pathname === "items"}
          aria-label="Item"
          strokeWidth={4}
        />
      </NavItem>
    </div>
  );
};

export default Sidebar;
