import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { DeviceContext } from "../providers";
import AvatarMenu from "./AvatarMenu";
import { Menu } from "lucide-react";
import { SearchIcon } from "../assets";

const Header = ({ sticky, classes }) => {
  const {
    isMobile,
    setShowSearch,
    showMenu,
    setShowMenu,
    width,
    setCurrentModal,
  } = useContext(DeviceContext);
  const router = useRouter();

  return (
    <div className={`w-full @container ${classes}`}>
      <div
        className={`w-full flex justify-between items-center gap-6 @md:gap-8 @lg:gap-16 @xl:gap-24`}
      >
        <img
          src="/inventorylogo.svg"
          alt="Inventory"
          width={120}
          height="auto"
          onClick={() => router.push("/locations")}
        />
        <div
          className={`${!width && "hidden"} ${
            isMobile ? "" : "gap-2"
          } flex items-center justify-end lg:min-w-fit`}
        >
          {isMobile ? (
            <>
              {" "}
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
              <Button
                onClick={() => setShowMenu(!showMenu)}
                classNames={{ root: "!px-1" }}
                variant="subtle"
                size="compact-lg"
                color="black"
              >
                <Menu
                  size={32}
                  strokeWidth={2.4}
                  className="lg:hidden"
                  aria-label="Menu"
                  onClick={() => setShowMenu(!showMenu)}
                />
              </Button>
            </>
          ) : (
            <AvatarMenu setCurrentModal={setCurrentModal} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
