import { useContext } from "react";
import { CardMenu, Favorite, LucideIcon, UpdateColor, UpdateIcon } from "..";
import { DeviceContext, ModalContext } from "../../providers";

const BaseListCard = ({
  item,
  data,
  type,
  name,
  isSelected,
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
  textWidth = type === "category"
    ? " max-lg:max-w-[50vw]"
    : " max-lg:max-w-[40vw]",
}) => {
  const { setCurrentModal, open, close, showDelete } = useContext(ModalContext);
  const { isMobile } = useContext(DeviceContext);

  const relative = showDelete ? "" : "relative";

  const openModal = (component, size = "lg") => {
    setCurrentModal({ component, size });
    open();
  };

  const onUpdateColor = () =>
    openModal(
      <UpdateColor
        item={item}
        data={data}
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
        data={data}
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
        data: data,
        handleSubmit: handleUpdate,
      })
    );

  return (
    <div
      className={`flex !w-full items-center justify-between gap-2 lg:gap-8 my-1 p-2 pl-3 border-b rounded cursor-pointer relative ${
        showDelete
          ? isSelected
            ? "bg-danger-200 hover:bg-danger-200"
            : "hover:bg-danger-100 opacity-40"
          : " hover:bg-bluegray-100"
      } ${isOver ? (disabled ? "hover:!white" : "!bg-primary-500") : ""}`}
    >
      <div
        className="h-full w-3/4 md:w-full absolute top-0 left-0"
        role="button"
        tabIndex={0}
        onClick={() => {
          handleClick(item);
        }}
      />

      <div className="flex gap-2 items-center justify-start">
        <LucideIcon
          iconName={item?.icon}
          type={type}
          fill={item?.color?.hex}
          size={22}
        />
        <div
          className={`flex items-center justify-start flex-row lg:flex-row gap-2 ${textWidth}`}
        >
          <h2
            className={`font-medium text-nowrap truncate text-ellipsis ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {name}
          </h2>
          <Favorite
            item={item}
            onClick={handleFavoriteClick}
            size={isMobile ? 20 : 18}
          />
        </div>
      </div>

      <div
        className={`flex gap-0.5 lg:gap-4 items-center justify-end ${relative}`}
      >
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
