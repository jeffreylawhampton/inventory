import { ChevronDown } from "lucide-react";

const DetailsTrigger = ({ showDetails, setShowDetails }) => {
  return (
    <button className="relative py-1 pl-1 pr-0">
      <ChevronDown
        size={18}
        className={`transition ${showDetails ? "rotate-180" : ""}`}
        aria-label={showDetails ? "Hide" : "Show"}
        onClick={() => setShowDetails(!showDetails)}
      />
    </button>
  );
};

export default DetailsTrigger;
