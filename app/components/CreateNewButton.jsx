import Tooltip from "./Tooltip";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";

const CreateNewButton = ({
  tooltipText,
  onClick,
  strokeWidth = 3,
  size = 35,
}) => {
  return (
    <Tooltip text={tooltipText} className="font-medium text-md">
      <Button
        size="lg"
        onPress={onClick}
        isIconOnly
        className="fixed xs:bottom80 sm:bottom80 md:bottom-8 right-8 bg-primary text-white bottom80 drop-shadow-lg"
      >
        <Plus aria-label={tooltipText} strokeWidth={strokeWidth} size={size} />
      </Button>
    </Tooltip>
  );
};

export default CreateNewButton;
