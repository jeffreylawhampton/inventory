import { usePathname } from "next/navigation";
import { Drawer } from "@mantine/core";
import Link from "next/link";
import {
  ContainerIcon,
  ItemsIcon,
  CategoryIcon,
  LocationIcon,
  UserIcon,
} from "@/app/assets";
import { LogOut, X } from "lucide-react";

import { v4 } from "uuid";

const MobileMenu = ({ opened, close }) => {
  const pathname = usePathname();

  const navItems = [
    {
      url: "/locations",
      icon: <LocationIcon width={26} aria-label="Location" strokeWidth={6} />,
      label: "Locations",
    },
    {
      url: "/containers",
      icon: <ContainerIcon width={32} strokeWidth={4} />,
      label: "Containers",
    },
    {
      url: "/categories",
      icon: <CategoryIcon width={32} aria-label="Category" strokeWidth={6} />,
      label: "Categories",
    },
    {
      url: "/items",
      icon: <ItemsIcon width={30} aria-label="Item" strokeWidth={6} />,
      label: "Items",
    },
    {
      url: "/user",
      icon: (
        <UserIcon
          // isSelected={pathname === "user"}
          width={28}
          aria-label="User"
          strokeWidth={3}
        />
      ),
      label: "Account",
    },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="sm"
      withCloseButton={false}
      transitionProps={{
        duration: 400,
      }}
      overlayProps={{
        backgroundOpacity: "0.2",
      }}
      classNames={{
        inner: "max-w-[85%]",
        content: "!bg-slate-100 w-fit pt-6 !px-0 ",
        body: "!p-0",
      }}
    >
      <div className="!w-full flex flex-col gap-0 h-screen max-h-[400px] mt-2">
        <button onClick={close} className="absolute right-5 top-3 z-20 p-1">
          <X aria-label="Close" size={20} />
        </button>
        {navItems.map(({ url, icon, label }) => {
          const isActive = pathname?.includes(url);
          return (
            <Link
              href={url}
              key={v4()}
              className={`flex mx-3 my-0.5 pl-4 pr-5 py-4 items-center justify-start gap-6 relative sidebar-icon group rounded ${
                isActive
                  ? "font-bold bg-primary-200/40"
                  : "hover:bg-primary-100 active:bg-primary-200"
              }`}
              prefetch={false}
              onClick={close}
            >
              <div
                className={`w-[32px] h-[32px] flex items-center justify-center ${
                  isActive
                    ? ` [&>svg>path]:!fill-primary-300 [&>svg>rect]:!fill-primary-500 [&>svg>circle]:!fill-primary-500 [&>svg>polygon]:!fill-primary-600  [&>svg]:scale-[115%]`
                    : "[&>svg>path]:group-hover:!fill-primary-300 [&>svg>rect]:group-hover:!fill-primary-500 [&>svg>circle]:group-hover:!fill-primary-500 [&>svg>polygon]:hover:!fill-primary-600 [&>svg]:hover:scale-[115%] [&>svg]:hover:!fill-primary-300 [&>svg]:group-hover:scale-[115%]"
                }`}
              >
                {icon}{" "}
              </div>
              {label}
            </Link>
          );
        })}
        <a
          href="/api/auth/logout"
          className="flex w-full mx-3 pl-4 pr-5 py-4 group items-center justify-start gap-4 relative sidebar-icon hover:bg-primary-100 active:bg-primary-300"
        >
          <div className="w-[32px] h-[32px] flex items-center justify-center group [&>svg]:scale-[115%] [&>svg>path]:group-hover:!fill-primary-200 ]&>svg]:group-hover:!scale-150">
            <LogOut
              strokeWidth={1.5}
              size={26}
              className="ml-1.5 group-hover:scale-[140%]"
            />
          </div>
          Log out
        </a>
      </div>
    </Drawer>
  );
};

export default MobileMenu;
