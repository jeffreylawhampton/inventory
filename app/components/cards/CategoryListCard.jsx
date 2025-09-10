import { useContext } from "react";
import { BaseListCard, CategoryForm } from "..";
import { Layers } from "lucide-react";
import {
  handleDeleteCategory,
  handleUpdateCategory,
} from "../../categories/handlers";
import { ModalContext } from "../../providers";

const CategoryListCard = ({
  category,
  isSelected,
  handleClick,
  data,
  handleFavoriteClick,
  mutateKey,
  isSafari = false,
}) => {
  const { showDelete } = useContext(ModalContext);
  return (
    <BaseListCard
      item={category}
      data={data}
      type="category"
      name={category.name}
      isSelected={isSelected}
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
