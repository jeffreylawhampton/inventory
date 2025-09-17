import { useContext } from "react";
import {
  CardMenu,
  CategoryPill,
  CategoryPopup,
  Favorite,
  ListViewBreadcrumbs,
  LucideIcon,
  UpdateIcon,
} from "..";
import { DeviceContext, ModalContext } from "../../providers";

const ListViewCard = ({
  item,
  data,
  showLocation,
  handleClick,
  handleFavoriteClick,
  handleEditClick,
  handleDeleteClick,
  mutateKey,
  isSelected,
  hideCategory = -1,
  textWidth = "max-md:max-w-[40vw]",
}) => {
  const { isMobile, width } = useContext(DeviceContext);

  const { setCurrentModal, open, close, showDelete, showRemove } =
    useContext(ModalContext);

  const handleUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={data}
          item={item}
          type="item"
          close={close}
          mutateKey={mutateKey}
        />
      ),
      size: "xl",
      title: null,
    });

    open();
  };

  const showTagPopup = width < 600 || false;

  return (
    <div
      className={`
       relative !w-full flex gap-4 justify-between p-2 pl-3 border-b rounded my-1 ${
         showDelete || showRemove
           ? "opacity-30 hover:bg-danger-200"
           : "hover:bg-bluegray-100"
       } ${
        (isSelected && showDelete) || (isSelected && showRemove)
          ? "bg-danger-200 !opacity-100"
          : ""
      }`}
    >
      <div
        className="absolute h-full w-3/4 md:w-full top-0 left-0 opacity-0"
        role="button"
        tabIndex={0}
        onClick={() => handleClick(item)}
      />
      <div className="flex gap-2.5 items-center">
        <LucideIcon iconName={item?.icon} type="item" size={20} />
        <div className={`flex flex-row-reverse gap-2 ${textWidth}`}>
          <Favorite
            item={item}
            onClick={handleFavoriteClick}
            size={isMobile ? 20 : 17}
          />
          <h2 className="text-nowrap font-medium !truncate !text-ellipsis text-sm lg:text-base">
            {item.name}
          </h2>
        </div>
      </div>
      <div className="flex gap-1.5 lg:gap-6 items-center justify-between relative max-w-lg:w-[80px]">
        {showTagPopup ? (
          <CategoryPopup item={item} />
        ) : (
          <div className="flex flex-wrap-none gap-1 items-center pl-10">
            {item?.categories?.map((category) => {
              return category?.id != hideCategory ? (
                <CategoryPill
                  category={category}
                  key={category.name}
                  showTag
                  maw="!max-w-20"
                />
              ) : null;
            })}
          </div>
        )}
        {showLocation ? (
          <div className="relative flex items-center">
            <ListViewBreadcrumbs data={{ ...item, type: "item" }} />
          </div>
        ) : null}
        <CardMenu
          item={item}
          type="item"
          handleDeleteClick={() => handleDeleteClick(item)}
          handleEditClick={() => handleEditClick(item)}
          handleIconClick={handleUpdateIcon}
        />
      </div>
    </div>
  );
};

export default ListViewCard;
