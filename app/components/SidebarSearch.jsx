import { useContext } from "react";
import Tooltip from "./Tooltip";
import { tooltipStyles } from "../lib/styles";
import { DeviceContext } from "../layout";
import { SidebarSearchIcon } from "../assets";

const SidebarSearch = () => {
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
        className={`flex w-[42px] h-[42px] items-center justify-center relative sidebar-icon hover:highlight [&>svg>path]:hover:fill-primary-400 [&>svg]:hover:scale-[115%]
    `}
      >
        <SidebarSearchIcon strokeWidth={9} width={30} />
      </button>
    </Tooltip>
  );
};

export default SidebarSearch;
