import { usePathname } from "next/navigation";
import { Drawer } from "@mantine/core";
import { sidenavItems } from "../lib/navItems";
import Link from "next/link";

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
        content: "!bg-slate-100 w-fit pt-10 !px-0",
        body: "!p-0",
      }}
    >
      <div className="!w-full flex flex-col gap-0 justify-between h-screen max-h-[400px]">
        {sidenavItems.map(({ name, navIcon, url }) => {
          const isActive =
            pathname === "/"
              ? pathname === url
              : pathname.includes(url) && url != "/";
          return (
            <Link
              href={url}
              key={name}
              onClick={close}
              className={`leading-none px-4 pl-7 py-5 h-full flex gap-6 font-medium text-lg items-center ${
                isActive && "!font-bold"
              } [&>svg]:scale-110 [&>svg]:transition [&>svg]:hover:opacity-100 hover:bg-slate-200 active:bg-slate-300
              `}
            >
              {navIcon}
              <span className={isActive && "bg-warning-200"}>{name}</span>
            </Link>
          );
        })}
      </div>
    </Drawer>
  );
};

export default MobileMenu;
