import { useContext } from "react";
import Tooltip from "./Tooltip";
import { tooltipStyles } from "../lib/styles";
import { SearchIcon } from "../assets";
import { DeviceContext } from "../layout";
import { IconSearch } from "@tabler/icons-react";

const SidebarSearch = ({ label, url, children, isSelected }) => {
  const { setShowSearch } = useContext(DeviceContext);
  return (
    <Tooltip
      label="Search for anything"
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
      <button
        onClick={() => setShowSearch(true)}
        className={`flex w-[42px] h-[42px] items-center justify-center relative sidebar-icon hover:highlight [&>svg>path]:fill-transparent
    `}
      >
        <IconSearch size={34} strokeWidth={2.5} />
        {/* <SearchIcon width={28} aria-label="Search" strokeWidth={6} /> */}
      </button>
    </Tooltip>
  );
};

export default SidebarSearch;
