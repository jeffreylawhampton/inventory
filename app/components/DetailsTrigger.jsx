import { IconChevronDown } from "@tabler/icons-react";

const DetailsTrigger = ({ showDetails, setShowDetails }) => {
  return (
    <button className="relative py-1 pl-1 pr-0">
      <IconChevronDown
        size={20}
        className={`transition ${showDetails ? "rotate-180" : ""}`}
        aria-label={showDetails ? "Hide" : "Show"}
        onClick={() => setShowDetails(!showDetails)}
      />
    </button>
  );
};

export default DetailsTrigger;
