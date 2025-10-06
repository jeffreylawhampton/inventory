import { useContext } from "react";
import {
  CardMenu,
  CategoryPill,
  CategoryPopup,
  Draggable,
  Favorite,
  ListViewBreadcrumbs,
  LucideIcon,
  UpdateIcon,
} from "..";
import { mutate } from "swr";
import { DeviceContext, FilterContext, ModalContext } from "@/app/providers";
import { handleNestedItemFavoriteClick } from "../../containers/handlers";
import { addIcon } from "../../lib/db";
import { mutateProps, notify } from "../../lib/handlers";

const ContainerListItemCard = ({
  item,
  isOverlay,
  activeItem,
  data,
  mutateKey,
  handleClick,
  handleEditClick,
  handleDeleteClick,
  showLocation = true,
  hideTags,
  bgColor = "bg-white",
  isSelected,
  isAccordion,
}) => {
  item = { ...item, type: "item" };

  const { setCurrentModal, close, open, showDelete } = useContext(ModalContext);
  const { isMobile, width } = useContext(DeviceContext);
  const { view } = useContext(FilterContext);

  const relative = showDelete ? "" : "relative";

  const showTags = width > 600 && !hideTags;

  let paddingLeft = item.depth * 18;
  paddingLeft += isMobile ? 11 : 7;

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
      type="item"
      sidebar
      classes="relative"
      isOverlay={isOverlay}
      disabled={showDelete}
      left="left-0"
    >
      <div
        style={
          isAccordion
            ? {}
            : {
                paddingLeft:
                  item?.depth === 1 || !item?.depth ? 33 : paddingLeft,
              }
        }
        className={`flex !w-full items-center justify-between gap-10 p-2 pr-1 relative rounded cursor-pointer text-black ${
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
          className="h-full w-3/4 md:w-full absolute top-0 left-0"
          role="button"
          tabIndex={0}
          onClick={() => handleClick(item)}
        />
        <div className={`flex gap-2 items-center pl-1 ${relative}`}>
          <LucideIcon iconName={item?.icon} type="item" size={20} />
          <h2
            className={`text-nowrap font-medium ${
              isMobile
                ? "text-sm max-w-[35vw] truncate text-ellipsis"
                : "text-base"
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
          />
        </div>
      </div>
    </Draggable>
  );
};

export default ContainerListItemCard;
