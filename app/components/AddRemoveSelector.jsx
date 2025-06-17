import {
  IconCircle,
  IconCircleCheck,
  IconCircleMinus,
} from "@tabler/icons-react";
const AddRemoveSelector = ({ isSelected, isRemove = false, iconSize = 26 }) => {
  return (
    <div className="absolute top-2 right-2">
      {isSelected ? (
        isRemove ? (
          <IconCircleMinus
            className="bg-danger text-white rounded-full"
            size={iconSize}
          />
        ) : (
          <IconCircleCheck
            className="bg-primary text-white rounded-full"
            size={iconSize}
          />
        )
      ) : (
        <IconCircle className="bg-white rounded-full" size={iconSize} />
      )}
    </div>
  );
};

export default AddRemoveSelector;
