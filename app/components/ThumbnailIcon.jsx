import { lucideIconList } from "@/lib/LucideIconList";
import { handlePreventLongPress } from "../items/handlers";
import { Box, Layers, Tag } from "lucide-react";
const ThumbnailIcon = ({ stroke, type, iconName, onClick }) => {
  const Icon = lucideIconList[iconName];

  const iconProps = {
    width: "100%",
    height: "100%",
    className: "select-none",
    stroke,
    onClick,
    onContextMenu: handlePreventLongPress,
  };

  if (!iconName || !Icon) {
    if (type === "container")
      return (
        <div className="w-2/5">
          <Box {...iconProps} on />
        </div>
      );
    if (type === "item") {
      return (
        <div className="w-2/5">
          <Layers {...iconProps} />
        </div>
      );
    }
    if (type === "category")
      return (
        <div className="w-2/5">
          <Tag {...iconProps} />
        </div>
      );
    if (!iconName) return <div />;
  }
  return (
    <div className="w-2/5">
      <Icon {...iconProps} />
    </div>
  );
};

export default ThumbnailIcon;
