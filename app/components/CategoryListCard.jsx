import BaseListCard from "./BaseListCard";
import CategoryForm from "./forms/CategoryForm";
import { Layers } from "lucide-react";
import {
  handleDeleteCategory,
  handleUpdateCategory,
} from "../categories/handlers";

const CategoryListCard = ({
  category,
  showDelete,
  isSelected,
  handleClick,
  data,
  handleFavoriteClick,
  mutateKey,
  isSafari = false,
}) => {
  return (
    <BaseListCard
      item={{ ...category, data }}
      type="category"
      name={category.name}
      isSelected={isSelected}
      showDelete={showDelete}
      handleClick={handleClick}
      handleFavoriteClick={handleFavoriteClick}
      handleUpdate={handleUpdateCategory}
      handleDeleteClick={() =>
        handleDeleteCategory({ category, data, isSafari })
      }
      mutateKey={mutateKey}
      pillCounts={
        <div
          className={`rounded-full py-[2px] min-w-12 flex gap-1 items-center justify-center text-sm font-semibold ${
            showDelete ? "bg-white/30" : "bg-bluegray-100"
          }`}
        >
          <Layers size={13} />
          {category?._count?.items}
        </div>
      }
      formComponent={({ item, close, data, handleSubmit }) => (
        <CategoryForm
          category={item}
          close={close}
          data={data}
          handleSubmit={handleSubmit}
        />
      )}
    />
  );
};

export default CategoryListCard;
