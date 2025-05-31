import { useContext } from "react";
import { Button } from "@mantine/core";
import { DeviceContext } from "../layout";
import { IconMenu2 } from "@tabler/icons-react";
import SearchIcon from "../assets/SearchIcon";

const Header = () => {
  const { isMobile, setShowSearch, showMenu, setShowMenu, crumbs, width } =
    useContext(DeviceContext);

  return (
    <div className="w-full @container">
      <div
        className={`w-full flex justify-between items-start gap-6 @md:gap-8 @lg:gap-16 @xl:gap-24`}
      >
        <div className="mt-1">{crumbs}</div>
        <div
          className={`${!width && "hidden"} ${
            isMobile ? "" : "gap-2"
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
              onClick={() => setShowMenu(!showMenu)}
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
                onClick={() => setShowMenu(!showMenu)}
              />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Header;
