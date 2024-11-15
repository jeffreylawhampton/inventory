import { IconBox, IconClipboardList } from "@tabler/icons-react";

const CountPills = ({
  containerCount,
  onClick,
  transparent,
  textClasses,
  verticalMargin = "my-2",
  pillClasses,
}) => {
  return (
    <div
      className={`${pillClasses} ${
        !containerCount && !transparent && "text-bluegray-700"
      }`}
    >
      <IconClipboardList size={18} strokeWidth={1.5} /> {containerCount}
    </div>
  );
};

export default CountPills;
