import { IconBox, IconClipboardList } from "@tabler/icons-react";

const CountPills = ({
  containerCount,
  itemCount,
  onClick,
  transparent,
  textClasses,
  showEmpty = true,
  showItems,
  showContainers,
}) => {
  const pillClasses = `flex gap-[4px] justify-center items-center ${textClasses} ${
    transparent ? "bg-white !bg-opacity-20" : "bg-white"
  } rounded-full px-3 py-[1px] font-semibold point`;

  const wrapperClasses = `flex gap-2 pl-2 h-[27px]`;

  const empty = showEmpty ? "opacity-70" : "";

  return (
    <div
      className={showItems && showContainers ? wrapperClasses : null}
      onClick={onClick ? onClick : null}
    >
      {showContainers ? (
        <div
          className={`${pillClasses} ${
            !containerCount && !transparent && "text-bluegray-700"
          }`}
        >
          <IconBox
            size={18}
            strokeWidth={1.5}
            className={containerCount ? "" : empty}
          />{" "}
          <span className={containerCount ? "" : empty}>{containerCount}</span>
        </div>
      ) : null}
      {showItems ? (
        <div
          className={`${pillClasses} ${
            !itemCount && !transparent && "text-bluegray-700"
          }`}
        >
          <IconClipboardList
            size={18}
            strokeWidth={1.5}
            className={itemCount ? "" : empty}
          />
          <span className={itemCount ? "" : empty}>{itemCount}</span>
        </div>
      ) : null}
    </div>
  );
};

export default CountPills;
