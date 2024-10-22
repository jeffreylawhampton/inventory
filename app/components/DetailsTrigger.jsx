import { IconChevronDown } from "@tabler/icons-react";

const DetailsTrigger = ({
  showDetails,
  setShowDetails,
  label = "Details",
  textSize = "text-sm",
  textColor = "text-primary-600 hover:text-primary-800 active:text-primary-900",
  fontWeight = "font-semibold",
  iconSize = 20,
}) => {
  return (
    <button
      className={`relative flex items-center gap-1 ${fontWeight} ${textSize} ${textColor}  py-1 pr-1`}
      onClick={() => setShowDetails(!showDetails)}
    >
      {label}
      <IconChevronDown
        size={iconSize}
        className={`transition ${showDetails ? "rotate-180" : ""}`}
        aria-label={showDetails ? "Hide" : "Show"}
      />
    </button>
  );
};

export default DetailsTrigger;
