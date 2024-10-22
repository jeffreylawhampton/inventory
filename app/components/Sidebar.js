"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@mantine/core";
import { sidenavItems } from "../lib/navItems";
import { tooltipStyles } from "../lib/styles";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div
      className={`z-40 shadow-lg px-4 pt-14 text-nowrap flex flex-col gap-8 items-center min-h-screen h-full fixed w-[60px]`}
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
            className={`flex w-[42px] h-[42px] items-center justify-center [&>svg]:scale-110 [&>svg]:transition [&>svg]:hover:opacity-100
              ${
                isActive
                  ? `highlight [&>svg]:scale-[1.1] [&>svg]:opacity-100`
                  : "[&>svg]:opacity-100 [&>svg]:hover:scale-115"
              } `}
          >
            <Tooltip
              label={name}
              position="right"
              delay={400}
              radius={tooltipStyles.radius}
              offset={tooltipStyles.offset}
              withArrow
              arrowSize={10}
              color="white"
              classNames={{
                tooltip: "!text-black !px-3 drop-shadow-md font-medium",
              }}
            >
              {navIcon}
            </Tooltip>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
