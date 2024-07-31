import { Button, Chip } from "@nextui-org/react";
import { removeAllCategories } from "../actions";
const _ = require("lodash");
import { Plus } from "lucide-react";

const EditCategories = ({ item, user }) => {
  const unselected = user?.categories?.filter(
    (category) => !item.categories.includes(category)
  );

  const removeCategories = async () => {
    await removeAllCategories({ itemId: item.id });
  };

  const categoriesToAdd = unselected?.map((category) => {
    return (
      <Chip
        key={category.name}
        className=""
        onClick={() => addCategoryMutation(category)}
      >
        <span className="flex gap-1 items-center justify-center">
          {category.name}{" "}
          <Plus className="w-3 h-3 bg-black text-white rounded-full" />
        </span>
      </Chip>
    );
  });

  const categoriesToRemove = item?.categories?.map((category) => {
    return (
      <Chip
        key={_.uniqueId}
        className="bg-slate-400 text-white"
        onClick={() => removeCategoryMutation(category.id)}
      >
        <span className="flex gap-1 items-center justify-center">
          {category.name}{" "}
          <Plus className="rotate-45 w-3 h-3 bg-black text-white rounded-full" />
        </span>
      </Chip>
    );
  });

  return (
    <div>
      {categoriesToAdd} {categoriesToRemove}
      <Button onClick={removeCategories}>Reomve</Button>
    </div>
  );
};

export default EditCategories;
