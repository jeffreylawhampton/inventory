import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, Tag } from "lucide-react";
const LucideIcon = ({
  size,
  stroke = "#000",
  fill = "transparent",
  type,
  iconName,
  onClick,
  classes = "flex-shrink-0",
}) => {
  const iconProps = {
    size,
    stroke,
    fill,
    type,
    iconName,
    onClick,
    className: classes,
  };

  if (!iconName) {
    if (type === "container") return <Box {...iconProps} />;
    if (type === "item") {
      return <Layers {...iconProps} />;
    }
    if (type === "category") return <Tag {...iconProps} />;
  }
  const Icon = lucideIconList[iconName]?.Component;

  return <Icon {...iconProps} />;
};

export default LucideIcon;
