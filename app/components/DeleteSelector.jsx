import { Circle, CircleMinus } from "lucide-react";
const DeleteSelector = ({ isSelectedForDeletion, iconSize = 22 }) => {
  return isSelectedForDeletion ? (
    <CircleMinus
      fill="white"
      color="var(--mantine-color-danger-6)"
      size={iconSize}
    />
  ) : (
    <Circle fill="white" size={iconSize} />
  );
};

export default DeleteSelector;
