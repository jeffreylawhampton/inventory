import { usePathname } from "next/navigation";
import { Drawer, Image } from "@mantine/core";
import Link from "next/link";
import {
  HomeIcon,
  ContainerIcon,
  ItemIcon,
  CategoryIcon,
  LocationIcon,
  UserIcon,
} from "../assets";
import { IconLogout, IconX } from "@tabler/icons-react";
import { v4 } from "uuid";

const MobileMenu = ({ opened, close }) => {
  const pathname = usePathname();

  const navItems = [
    {
      url: "/locations",
      icon: (
        <LocationIcon
          width={26}
          aria-label="Location"
          strokeWidth={6}
          isSelected={pathname?.includes("locations")}
        />
      ),
      label: "Locations",
    },
    {
      url: "/containers",
      icon: (
        <ContainerIcon
          width={32}
          aria-label="Container"
          isSelected={pathname?.includes("containers")}
          strokeWidth={4}
        />
      ),
      label: "Containers",
    },
    {
      url: "/categories",
      icon: (
        <CategoryIcon
          width={32}
          isSelected={pathname?.includes("categories")}
          aria-label="Category"
          strokeWidth={6}
        />
      ),
      label: "Categories",
    },
    {
      url: "/items",
      icon: (
        <ItemIcon
          width={28}
          isSelected={pathname?.includes("items")}
          aria-label="Item"
          strokeWidth={4}
        />
      ),
      label: "Items",
    },
    {
      url: "/user",
      icon: (
        <UserIcon
          isSelected={pathname === "user"}
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
      <div className="!w-full flex flex-col gap-0  h-screen max-h-[400px]">
        <Image
          src="/inventorylogo.svg"
          alt="Inventory"
          className="!w-[130px] ml-6 mb-5 mt-4"
        />
        <button onClick={close} className="absolute right-5 top-5">
          <IconX aria-label="Close" size={28} strokeWidth={2.5} />
        </button>
        {navItems.map(({ url, icon, label }) => {
          const isActive = pathname === url;
          return (
            <Link
              href={url}
              key={v4()}
              className={`flex w-full px-5 py-3 my-1 items-center justify-start gap-4 relative sidebar-icon ${
                isActive ? "font-bold" : "hover:bg-warning-100"
              }`}
              prefetch={false}
              onClick={close}
            >
              <div
                className={`w-[32px] h-[32px] flex items-center justify-center ${
                  isActive
                    ? `highlight [&>svg>path]:!fill-primary-300 [&>svg>rect]:!fill-primary-500 [&>svg>circle]:!fill-primary-500 [&>svg>polygon]:!fill-primary-600 [&>svg]:hover:scale-[115%] [&>svg]:hover:!fill-primary-300 [&>svg]:scale-[115%]`
                    : ""
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
          className="flex w-full px-5 py-3 my-1 items-center justify-start gap-4 relative sidebar-icon"
        >
          <div className="w-[32px] h-[32px] flex items-center justify-center[&>svg]:scale-[115%]">
            <IconLogout size={40} strokeWidth={1.5} />
          </div>
          Log out
        </a>
      </div>
    </Drawer>
  );
};

export default MobileMenu;
