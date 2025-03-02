import { usePathname } from "next/navigation";
import { Drawer, Image, NavLink } from "@mantine/core";
import { sidenavItems } from "../lib/navItems";
import { IconLogout } from "@tabler/icons-react";
import { iconStyles } from "../lib/styles";

const MobileMenu = ({ opened, open, close }) => {
  const pathname = usePathname();
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
        content: "!bg-slate-100 w-fit pt-6 !px-0",
        body: "!p-0",
      }}
    >
      <div className="!w-full flex flex-col gap-0 justify-between h-screen max-h-[400px]">
        <Image
          src="/inventorylogo.svg"
          alt="Inventory"
          className="!w-[130px] ml-6 mb-4"
        />
        {sidenavItems.map(({ name, navIcon, url }) => {
          const isActive =
            pathname === "/"
              ? pathname === url
              : pathname.includes(url) && url != "/";
          return (
            <NavLink
              href={url}
              key={name}
              onClick={close}
              leftSection={navIcon}
              active={isActive}
              label={name}
              classNames={{
                root: "!p-5 gap-1 !items-center",
                label: "!text-lg font-semibold !text-black",
                active: "!bg-danger-500",
              }}
              color="#F4BB6A"
              variant="filled"
            />
          );
        })}
        <NavLink
          href="/api/auth/logout"
          key="logout"
          leftSection={
            <IconLogout
              aria-label="Logout"
              size={iconStyles.size}
              strokeWidth={iconStyles.strokeWidth}
              className={iconStyles.classes}
            />
          }
          label="Log out"
          classNames={{
            root: "!p-6  gap-1 !items-center",
            label: "!text-lg font-semibold !text-black",
            active: "!bg-danger-500",
          }}
          color="#F4BB6A"
          variant="filled"
        />
      </div>
    </Drawer>
  );
};

export default MobileMenu;
