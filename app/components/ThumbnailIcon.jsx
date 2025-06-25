import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, Tag } from "lucide-react";
const ThumbnailIcon = ({ stroke, fill, type, iconName, onClick }) => {
  const Icon = lucideIconList[iconName];

  if (!iconName || !Icon) {
    if (type === "container")
      return <Box size={size} stroke={stroke} fill={fill} onClick={onClick} />;
    if (type === "item") {
      return <Layers size={size} stroke={stroke} onClick={onClick} />;
    }
    if (type === "category")
      return <Tag size={size} stroke={stroke} fill={fill} onClick={onClick} />;
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
