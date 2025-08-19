import { useState, useContext } from "react";
import Favorite from "./Favorite";
import { CardMenu, PickerMenu, UpdateColor, UpdateIcon } from ".";
import { DeviceContext } from "../providers";

const BaseListCard = ({
  item,
  type,
  name,
  isSelected,
  showDelete = false,
  breadcrumbs = null,
  formComponent,
  handleClick,
  handleFavoriteClick,
  handleUpdate,
  handleDeleteClick,
  mutateKey,
  pillCounts = [],
  isOver = false,
  disabled = false,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { setCurrentModal, open, close, isMobile } = useContext(DeviceContext);

  const openModal = (component, size = "lg") => {
    setCurrentModal({ component, size });
    setPickerOpen(false);
    open();
  };

  const onUpdateColor = () =>
    openModal(
      <UpdateColor
        item={item}
        data={item.data}
        close={close}
        mutateKey={mutateKey}
        type={type}
        additionalMutate={
          type === "category" ? "/categories/api" : "/containers/api"
        }
      />
    );

  const onUpdateIcon = () =>
    openModal(
      <UpdateIcon
        item={item}
        data={item.data}
        close={close}
        mutateKey={mutateKey}
        type={type}
      />,
      "xl"
    );

  const onEdit = () =>
    openModal(
      formComponent({
        item,
        close,
        data: item.data,
        handleSubmit: handleUpdate,
      })
    );

  return (
    <div
      className={`flex !w-full items-center justify-between gap-4 my-1 p-2 pr-1 border-b relative rounded cursor-pointer ${
        showDelete
          ? isSelected
            ? "bg-danger-200 hover:bg-danger-200"
            : "hover:bg-danger-100 opacity-40"
          : " hover:bg-bluegray-100"
      } ${isOver ? (disabled ? "hover:!white" : "!bg-primary-500") : ""}`}
    >
      <div
        className="w-full h-full absolute top-0 left-0"
        role="button"
        tabIndex={0}
        onClick={() => {
          handleClick(item);
        }}
      />

      <div className="flex gap-2 items-center justify-start ">
        <PickerMenu
          opened={pickerOpen}
          setOpened={setPickerOpen}
          data={item}
          type={type}
          isCard
          handleIconPickerClick={onUpdateIcon}
          updateColorClick={onUpdateColor}
        />
        <div className="flex items-center justify-start flex-row-reverse lg:flex-row gap-2">
          <h2
            className={`font-medium text-nowrap max-xs:max-w-[100px] truncate text-ellipsis ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {name}
          </h2>
          <Favorite item={item} onClick={handleFavoriteClick} />
        </div>
      </div>

      <div className="flex gap-2 lg:gap-6 items-center justify-end relative">
        {pillCounts}
        {breadcrumbs}
        <CardMenu
          item={item}
          type={type}
          disabled={showDelete}
          handleEditClick={onEdit}
          handleColorClick={onUpdateColor}
          handleIconClick={onUpdateIcon}
          handleDeleteClick={() => handleDeleteClick(item)}
        />
      </div>
    </div>
  );
};

export default BaseListCard;
