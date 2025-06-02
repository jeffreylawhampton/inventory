import { IconCircle, IconCircleMinus } from "@tabler/icons-react";
const DeleteSelector = ({ isSelectedForDeletion, iconSize = 22 }) => {
  return isSelectedForDeletion ? (
    <IconCircleMinus
      fill="white"
      color="var(--mantine-color-danger-6)"
      size={iconSize}
    />
  ) : (
    <IconCircle fill="white" size={iconSize} />
  );
};

export default DeleteSelector;
