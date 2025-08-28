import { useContext } from "react";
import {
  CardMenu,
  CategoryPill,
  Favorite,
  ListCardIcon,
  ListViewBreadcrumbs,
  UpdateIcon,
} from ".";
import { DeviceContext, ModalContext } from "../providers";
import CategoryPopup from "./CategoryPopup";

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
       relative !w-full flex gap-4 justify-between py-2 border-b rounded my-1 pl-2 pr-0 ${
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
        className="absolute w-full h-full top-0 left-0 opacity-0"
        role="button"
        tabIndex={0}
        onClick={() => handleClick(item)}
      />
      <div className="flex gap-2.5 items-center">
        <ListCardIcon item={item} type="item" onClick={handleUpdateIcon} />
        <div className="flex lg:flex-row-reverse gap-2 max-md:max-w-[32vw]">
          <Favorite
            item={item}
            onClick={handleFavoriteClick}
            size={isMobile ? 22 : 17}
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
          iconSize={isMobile ? 24 : 26}
        />
      </div>
    </div>
  );
};

export default ListViewCard;
