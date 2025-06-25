import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, Tag } from "lucide-react";
const ThumbnailIcon = ({ stroke, fill, type, iconName, onClick }) => {
  const Icon = lucideIconList[iconName];

  if (!iconName || !Icon) {
    if (type === "container")
      return (
        <div className="w-2/5">
          <Box
            width="100%"
            height="100%"
            stroke={stroke}
            fill={fill}
            onClick={onClick}
          />
        </div>
      );
    if (type === "item") {
      return (
        <div className="w-2/5">
          <Layers
            width="100%"
            height="100%"
            stroke={stroke}
            onClick={onClick}
          />
        </div>
      );
    }
    if (type === "category")
      return (
        <div className="w-2/5">
          <Tag
            width="100%"
            height="100%"
            stroke={stroke}
            fill={fill}
            onClick={onClick}
          />
        </div>
      );
    if (!iconName) return <div />;
  }
  return (
    <div className="w-2/5">
      <Icon
        width="100%"
        height="100%"
        stroke={stroke ?? "#000000"}
        fill={fill ?? "transparent"}
        onClick={onClick}
      />
    </div>
  );
};

export default ThumbnailIcon;
