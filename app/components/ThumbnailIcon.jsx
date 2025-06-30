import { lucideIconList } from "@/lib/LucideIconList";
import { Box, Layers, Tag } from "lucide-react";
const ThumbnailIcon = ({
  stroke,
  type,
  iconName,
  onClick,
  containerWidth = "w-2/5",
}) => {
  const Icon = lucideIconList[iconName];

  const iconProps = {
    width: "100%",
    height: "100%",
    className: "select-none",
    stroke,
    onClick,
  };

  if (!iconName || !Icon) {
    if (type === "container")
      return (
        <div className={containerWidth}>
          <Box {...iconProps} on />
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
    if (!iconName) return <div />;
  }
  return (
    <div className={containerWidth}>
      <Icon {...iconProps} />
    </div>
  );
};

export default ThumbnailIcon;
