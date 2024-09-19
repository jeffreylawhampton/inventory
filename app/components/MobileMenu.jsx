import { Drawer, Button } from "@mantine/core";
import { sidenavItems } from "../lib/navItems";
import Link from "next/link";

const MobileMenu = ({ opened, open, close }) => {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="xs"
      withCloseButton={false}
      transitionProps={{
        duration: 400,
      }}
      overlayProps={{
        backgroundOpacity: "0.2",
      }}
      classNames={{
        content: "!bg-slate-100 w-fit pt-10 !px-0",
        body: "!p-0",
      }}
    >
      <div className="!w-full flex flex-col gap-0 justify-between h-screen max-h-[400px]">
        {sidenavItems.map(({ name, navIcon, url }) => {
          return (
            <Link
              href={url}
              key={name}
              onClick={close}
              className={`leading-none px-4 pl-8 py-5 h-full flex gap-4 font-medium text-lg items-center [&>svg]:scale-110 [&>svg]:transition [&>svg]:hover:opacity-100 hover:bg-slate-200 active:bg-slate-300
              `}
            >
              {navIcon} {name}
            </Link>
          );
        })}
      </div>
    </Drawer>
  );
};

export default MobileMenu;
