import { useContext } from "react";
import {
  CardMenu,
  CategoryPill,
  Draggable,
  Favorite,
  ListCardIcon,
  ListViewBreadcrumbs,
  UpdateIcon,
} from "@/app/components";
import { mutate } from "swr";
import { DeviceContext } from "@/app/providers";
import { handleNestedItemFavoriteClick } from "../containers/handlers";
import { addIcon } from "../lib/db";
import { mutateProps, notify } from "../lib/handlers";
import CategoryPopup from "./CategoryPopup";

const ContainerListItemCard = ({
  item,
  isOverlay,
  activeItem,
  data,
  mutateKey,
  handleClick,
  handleEditClick,
  handleDeleteClick,
  selectedContainers,
  showLocation = true,
  hideTags,
  bgColor = "bg-white",
}) => {
  item = { ...item, type: "item" };

  const { isMobile, setCurrentModal, close, open, width, showDelete, view } =
    useContext(DeviceContext);

  const relative = showDelete ? "" : "relative";

  const showTags = width > 600 && !hideTags;

  const isSelected = selectedContainers?.find((c) => c.name === item.name);

  let paddingLeft = item.depth * 18;
  paddingLeft += 18;

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
        ...(item?.containerId === data.id
          ? {
              items: data?.items?.map((i) =>
                i.id === item.id ? { ...i, icon: iconName } : i
              ),
            }
          : {
              containers: data?.containers?.map((c) =>
                c.id === item.containerId
                  ? {
                      ...c,
                      items: c.items?.map((i) =>
                        i.id === item.id ? { ...i, icon: iconName } : i
                      ),
                    }
                  : c
              ),
            }),
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
      classes="relative"
      isOverlay={isOverlay}
      disabled={showDelete}
      left="left-0"
    >
      <div
        style={{ paddingLeft: item?.depth === 1 ? 8 : paddingLeft }}
        className={`flex !w-full items-center justify-between gap-4 p-2 pr-1 relative rounded cursor-pointer text-black ${
          showDelete
            ? isSelected
              ? view === 1
                ? "!bg-danger-600 !text-white"
                : "!bg-danger-200"
              : "bg-white opacity-30 hover:bg-danger-100"
            : `${bgColor} hover:bg-bluegray-100`
        }`}
      >
        <div
          className="w-full h-full absolute top-0 left-0"
          role="button"
          tabIndex={0}
          onClick={() => handleClick(item)}
        />
        <div className={`flex gap-2 items-center pl-1 ${relative}`}>
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
            size={17}
          />
        </div>

        <div
          className={`flex ${relative} ${
            showTags ? "gap-4" : "gap-1.5"
          } items-center justify-between max-w-lg:w-[80px] min-h-[32px]`}
        >
          {showTags ? (
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
          ) : (
            <CategoryPopup item={item} />
          )}

          {showLocation ? (
            <div className="relative flex items-center pl-1">
              <ListViewBreadcrumbs data={{ ...item, type: "item" }} />
            </div>
          ) : null}
          <CardMenu
            item={item}
            type={"item"}
            disabled={showDelete}
            handleEditClick={handleEditClick}
            handleIconClick={onUpdateIcon}
            handleDeleteClick={() => handleDeleteClick(item)}
            iconSize={isMobile ? 22 : 26}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default ContainerListItemCard;
