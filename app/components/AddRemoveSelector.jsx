import { Circle, CircleCheck, CircleMinus } from "lucide-react";
const AddRemoveSelector = ({ isSelected, isRemove = false, iconSize = 26 }) => {
  return (
    <div className="absolute top-2 right-2">
      {isSelected ? (
        isRemove ? (
          <CircleMinus
            className="bg-danger text-white rounded-full"
            size={iconSize}
          />
        ) : (
          <CircleCheck
            className="bg-primary text-white rounded-full"
            size={iconSize}
          />
        )
      ) : (
        <Circle className="bg-white rounded-full" size={iconSize} />
      )}
    </div>
  );
};

export default AddRemoveSelector;
