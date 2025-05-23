import { useContext } from "react";
import { Button } from "@mantine/core";
import { DeviceContext } from "../layout";
import { IconMenu2 } from "@tabler/icons-react";
import SearchIcon from "../assets/SearchIcon";

const Header = () => {
  const { isMobile, setShowSearch, opened, open, close, crumbs, width } =
    useContext(DeviceContext);

  return (
    <div
      className={`w-full flex justify-between items-start gap-5 md:gap-16 lg:gap-20 xl:gap-32`}
    >
      <div className="mt-1">{crumbs}</div>
      <div
        className={`${
          !width && "hidden"
        } flex items-center justify-end lg:min-w-fit`}
      >
        <Button
          component="a"
          href="/api/auth/logout"
          size="xs"
          classNames={{
            root: "!hidden lg:!block !bg-black",
            label: "text-sm",
          }}
        >
          Log out
        </Button>
        <Button
          onClick={() => setShowSearch(true)}
          size={isMobile ? "compact-lg" : "xs"}
          classNames={{
            label: "text-sm",
            root: "!px-2",
          }}
          variant={isMobile ? "subtle" : "outline"}
          color="black"
        >
          <span className="flex gap-1">
            <SearchIcon fill="black" classes="w-6 lg:w-[14px]" />
            <span className="hidden lg:block">Search</span>
          </span>
        </Button>
        {isMobile ? (
          <Button
            onClick={opened ? close : open}
            classNames={{ root: "!px-1" }}
            variant="subtle"
            size="compact-lg"
            color="black"
          >
            <IconMenu2
              size={32}
              strokeWidth={2.4}
              className="lg:hidden"
              aria-label="Menu"
              onClick={opened ? close : open}
            />
          </Button>
        ) : null}
      </div>
    </div>
  );
};
export default Header;
