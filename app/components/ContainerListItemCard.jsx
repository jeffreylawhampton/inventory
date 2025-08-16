import { useContext } from "react";
import {
  CardMenu,
  CategoryPill,
  Draggable,
  Favorite,
  ListCardIcon,
  UpdateIcon,
} from "@/app/components";
import { mutate } from "swr";
import { DeviceContext } from "@/app/providers";
import { handleNestedItemFavoriteClick } from "../containers/handlers";
import { addIcon } from "../lib/db";
import { mutateProps, notify } from "../lib/handlers";

const ContainerListItemCard = ({
  item,
  isOverlay,
  showDelete,
  activeItem,
  data,
  mutateKey,
  handleClick,
  handleEditClick,
  handleDeleteClick,
  selectedContainers,
}) => {
  item = { ...item, type: "item" };

  const { isMobile, setCurrentModal, close, open } = useContext(DeviceContext);

  const isSelected = selectedContainers?.find((c) => c.name === item.name);

  let paddingLeft = item.depth * 24;
  paddingLeft += isMobile ? 26 : 4;

  const handleAddIcon = async (iconName) => {
    let optimisticData;
    if (Array.isArray(data)) {
      optimisticData = data?.map((c) =>
        c.id === item.containerId
          ? {
              ...c,
              items: c.items?.map((i) =>
                i.id === item.id ? { ...i, icon: iconName } : i
              ),
            }
          : c
      );
    } else {
      optimisticData = {
        ...data,
        items: data?.items?.map((i) =>
          i.id === item.id ? { ...i, icon: iconName } : i
        ),
      };
    }
    try {
      await mutate(
        mutateKey,
        addIcon({ id: item.id, type: "item", iconName }),
        {
          optimisticData,
          ...mutateProps,
        }
      );
      notify({ message: "Icon updated" });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  const onUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          item={item}
          data={data}
          close={close}
          mutateKey={mutateKey}
          type={"item"}
          onSelectOverride={handleAddIcon}
        />
      ),
      size: "xl",
    });
    open();
  };

  return activeItem?.id === item?.id || !item ? null : (
    <Draggable
      activeItem={activeItem}
      id={item?.id}
      item={item}
      isSelected={isSelected}
      type="item"
      sidebar
      classes="my-1 relative"
      isOverlay={isOverlay}
      disabled={showDelete}
    >
      <div
        style={{ paddingLeft: item?.depth === 1 ? 8 : paddingLeft }}
        className={`flex !min-w-[500px] !w-full items-center justify-between gap-4 p-2 pr-1 relative rounded cursor-pointer ${
          showDelete
            ? isSelected
              ? "!bg-danger-200"
              : "opacity-30 hover:bg-danger-100"
            : "hover:bg-bluegray-100"
        }`}
      >
        <div
          className="w-full h-full absolute top-0 left-0"
          role="button"
          tabIndex={0}
          onClick={() => handleClick(item)}
        />
        <div
          className={`flex gap-2 items-center relative ${
            isMobile && !item?.depth ? "pl-6" : ""
          }`}
        >
          <ListCardIcon
            item={item}
            type="item"
            onClick={showDelete ? () => handleClick(item) : onUpdateIcon}
            isSelected={isSelected}
          />
          <h2
            className={`text-nowrap font-medium ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {item.name}
          </h2>
          <Favorite
            item={item}
            onClick={
              showDelete
                ? () => handleClick(item)
                : () => handleNestedItemFavoriteClick({ item, data, mutateKey })
            }
            showDelete={showDelete}
            size={17}
          />
        </div>

        <div className="flex gap-6 lg:gap-8 items-center justify-end relative">
          <div className="flex flex-wrap-none gap-1 items-center pl-10">
            {item?.categories?.map((category) => {
              return (
                <CategoryPill
                  category={category}
                  key={category.name}
                  showTag
                  maw="!max-w-20"
                />
              );
            })}
          </div>

          <CardMenu
            item={item}
            type={"item"}
            disabled={showDelete}
            handleEditClick={handleEditClick}
            handleIconClick={onUpdateIcon}
            handleDeleteClick={() => handleDeleteClick(item)}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default ContainerListItemCard;
