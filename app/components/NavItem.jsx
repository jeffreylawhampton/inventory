import Link from "next/link";
import Tooltip from "./Tooltip";
import { tooltipStyles } from "../lib/styles";

const NavItem = ({ label, url, children, isSelected }) => {
  return (
    <Tooltip
      label={label}
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
      <Link
        href={url}
        data-active={isSelected}
        className={`flex w-[42px] h-[42px] items-center justify-center relative sidebar-icon hover:highlight [&>svg>path]:data-[active=true]:fill-primary-300 [&>svg>rect]:data-[active=true]:fill-primary-500 [&>svg>circle]:data-[active=true]:fill-primary-500 [&>svg]:hover:scale-[115%] [&>svg]:hover:!fill-primary-300 [&>svg]:data-[active=true]:scale-[115%] ${
          isSelected ? "highlight" : ""
        }
    `}
      >
        {children}
      </Link>
    </Tooltip>
  );
};

export default NavItem;
