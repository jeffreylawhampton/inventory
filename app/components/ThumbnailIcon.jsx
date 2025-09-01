import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, MapPin, Tag } from "lucide-react";
const ThumbnailIcon = ({
  stroke,
  type,
  iconName,
  onClick,
  containerWidth = "w-2/5",
}) => {
  const iconProps = {
    width: "100%",
    height: "100%",
    className: "select-none",
    stroke,
    onClick,
  };

  if (!iconName) {
    if (type === "container")
      return (
        <div className={containerWidth}>
          <Box {...iconProps} />
        </div>
      );
    if (type === "location")
      return (
        <div className={containerWidth}>
          <MapPin {...iconProps} />
        </div>
      );
    if (type === "item") {
      return (
        <div className={containerWidth}>
          <Layers {...iconProps} />
        </div>
      );
    }
    if (type === "category")
      return (
        <div className={containerWidth}>
          <Tag {...iconProps} />
        </div>
      );
  }
  const Icon = lucideIconList[iconName]?.Component;

  return (
    <div className={containerWidth}>
      <Icon {...iconProps} />
    </div>
  );
};

export default ThumbnailIcon;
