import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, Tag } from "lucide-react";
const LucideIcon = ({ size, stroke, fill, type, iconName, onClick }) => {
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
    <Icon
      size={size}
      stroke={stroke ?? "#000000"}
      fill={fill ?? "transparent"}
      onClick={onClick}
    />
  );
};

export default LucideIcon;
