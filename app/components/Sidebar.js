"use client";
import { Box, Home, MapPin, Tags, CircleUser, List } from "lucide-react";
import Link from "next/link";
import Tooltip from "./Tooltip";
import { usePathname } from "next/navigation";

const iconClasses =
  "transition duration-300 opacity-50 hover:opacity-100 hover:scale-125";

const sidenavItems = [
  {
    name: "Home",
    navIcon: <Home aria-label="Home" />,
    url: "/",
  },
  {
    name: "Locations",
    navIcon: <MapPin aria-label="Locations" />,
    url: "/locations",
  },
  {
    name: "Containers",
    navIcon: <Box aria-label="Containers" />,
    url: "/containers",
  },
  {
    name: "Categories",
    navIcon: <Tags aria-label="Categories" />,
    url: "/categories",
  },
  { name: "Items", navIcon: <List aria-label="Items" />, url: "/items" },
  {
    name: "Account",
    navIcon: <CircleUser aria-label="Account" />,
    url: "/user",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div
      className={`z-40 shadow-lg px-4 pt-10 text-nowrap flex flex-col items-center gap-10 h-screen bg-slate-100 fixed w-[60px]`}
    >
      {sidenavItems.map(({ name, navIcon, url }) => {
        const isActive =
          pathname === "/"
            ? pathname === url
            : pathname.includes(url) && url != "/";
        return (
          <Link
            href={url}
            key={name}
            className={`[&>svg]:scale-110 [&>svg]:transition [&>svg]:hover:opacity-100
              ${
                isActive
                  ? `[&>svg]:scale-[1.2] [&>svg]:opacity-100`
                  : "[&>svg]:opacity-40 [&>svg]:hover:scale-125"
              } `}
          >
            <Tooltip text={name} placement="right" delay={400}>
              {navIcon}
            </Tooltip>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
