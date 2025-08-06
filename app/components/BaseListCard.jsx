// components/BaseListCard.jsx
import { useState, useContext } from "react";
import Favorite from "./Favorite";
import { CardMenu, PickerMenu, UpdateColor, UpdateIcon } from ".";
import { DeviceContext } from "../providers";

const BaseListCard = ({
  item,
  type,
  name,
  //   count,
  isSelected,
  showDelete = false,
  //   showLocation = false,
  breadcrumbs = null,
  formComponent,
  handleClick,
  handleFavoriteClick,
  handleUpdate,
  handleDeleteClick,
  mutateKey,
  pillCounts = [],
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { setCurrentModal, open, close, isMobile } = useContext(DeviceContext);

  const openModal = (component, size = "lg") => {
    setCurrentModal({ component, size });
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
        revalidate={false}
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
      className={`flex !w-full items-center justify-between gap-4 my-1 p-2 pr-0 border-b relative rounded cursor-pointer ${
        showDelete ? "hover:bg-danger-100" : "hover:bg-bluegray-100"
      } ${isSelected && showDelete ? "bg-danger-200 hover:bg-danger-200" : ""}`}
      role="button"
      tabIndex={0}
    >
      <div
        className="w-full h-full absolute top-0 left-0"
        onClick={() => handleClick(item)}
      />
      <div className="flex gap-2 items-center justify-start">
        <PickerMenu
          opened={pickerOpen}
          setOpened={setPickerOpen}
          data={item}
          type={type}
          isCard
          handleIconPickerClick={onUpdateIcon}
          updateColorClick={onUpdateColor}
        />
        <h2
          className={`font-medium text-nowrap ${
            isMobile ? "text-sm" : "text-base"
          }`}
        >
          {name}
        </h2>
        <Favorite item={item} onClick={handleFavoriteClick} />
      </div>

      <div className="flex gap-6 items-center justify-end relative">
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
