import { Minus } from "lucide-react";
const DeleteSelector = ({ isSelectedForDeletion, iconSize = 18 }) => {
  return (
    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
      {isSelectedForDeletion ? (
        <Minus
          size={iconSize}
          strokeWidth={iconSize / 6}
          color="var(--mantine-color-danger-4)"
        />
      ) : null}
    </div>
  );
};

export default DeleteSelector;
