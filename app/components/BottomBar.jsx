"use client";
import { Box, Home, MapPin, Tags, CircleUser, List } from "lucide-react";
import Link from "next/link";
import Tooltip from "./Tooltip";

const iconClasses =
  "transition duration-300 opacity-50 hover:opacity-100 hover:scale-125 ";

const size = 30;

const sidenavItems = [
  {
    name: "Home",
    navIcon: <Home className={iconClasses} size={size} aria-label="Home" />,
    url: "/",
  },
  {
    name: "Locations",
    navIcon: (
      <MapPin className={iconClasses} size={size} aria-label="Locations" />
    ),
    url: "/locations",
  },
  {
    name: "Containers",
    navIcon: (
      <Box className={iconClasses} size={size} aria-label="Containers" />
    ),
    url: "/containers",
  },
  {
    name: "Categories",
    navIcon: (
      <Tags className={iconClasses} size={size} aria-label="Categories" />
    ),
    url: "/categories",
  },
  {
    name: "Items",
    navIcon: <List className={iconClasses} size={size} aria-label="Items" />,
    url: "/items",
  },
  {
    name: "Account",
    navIcon: (
      <CircleUser className={iconClasses} size={size} aria-label="Account" />
    ),
    url: "/user",
  },
];

const BottomBar = () => {
  return (
    <div
      className={`z-40 shadow-lg px-4 text-nowrap fixed left-0 flex flex-row bottom-0 h-[60px] w-screen justify-around items-center gap-8 bg-slate-100`}
    >
      {sidenavItems.map(({ name, navIcon, url }) => {
        return (
          <Link href={url} key={name}>
            <Tooltip text={name} placement="top" delay={400}>
              {navIcon}
            </Tooltip>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomBar;
