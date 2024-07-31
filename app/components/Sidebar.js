"use client";
import { Box, Home, MapPin, Tags, CircleUser, List } from "lucide-react";
import Link from "next/link";
import Tooltip from "./Tooltip";

const iconClasses =
  "transition duration-300 opacity-50 hover:opacity-100 hover:scale-125";

const sidenavItems = [
  {
    name: "Home",
    navIcon: <Home className={iconClasses} />,
    url: "/",
  },
  {
    name: "Locations",
    navIcon: <MapPin className={iconClasses} />,
    url: "/locations",
  },
  {
    name: "Containers",
    navIcon: <Box className={iconClasses} />,
    url: "/containers",
  },
  {
    name: "Categories",
    navIcon: <Tags className={iconClasses} />,
    url: "/categories",
  },
  { name: "Items", navIcon: <List className={iconClasses} />, url: "/items" },
  {
    name: "Account",
    navIcon: <CircleUser className={iconClasses} />,
    url: "/user",
  },
];

const Sidebar = () => {
  return (
    <div
      className={`z-40 shadow-lg px-4 pt-10 text-nowrap flex flex-col items-center gap-8 h-screen bg-slate-100 fixed w-[60px]`}
    >
      {sidenavItems.map(({ name, navIcon, url }) => {
        return (
          <Link href={url} key={name}>
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
