import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  DeleteSelector,
  Favorite,
  ListCardIcon,
  UpdateIcon,
} from "@/app/components";
import { mutate } from "swr";
import Draggable from "../locations/Draggable";
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
  selectedContainers,
}) => {
  item = { ...item, type: "item" };
  const router = useRouter();

  const { isMobile, setCurrentModal, close, open } = useContext(DeviceContext);

  const paddingLeft = item.depth * 24;

  const isSelected = selectedContainers?.includes(item);

  const handleAddIcon = async (iconName) => {
    try {
      await mutate(
        mutateKey,
        addIcon({ id: item.id, type: "item", iconName }),
        {
          optimisticData: data?.map((c) =>
            c.id === item.containerId
              ? {
                  ...c,
                  items: c.items?.map((i) =>
                    i.id === item.id ? { ...i, icon: iconName } : i
                  ),
                }
              : c
          ),
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

  return (activeItem?.id === item?.id && !isOverlay) || !item ? null : (
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
      <div className="relative">
        <div
          className="w-full h-full absolute top-0 left-0"
          role="button"
          tabIndex={0}
          onClick={() => handleClick(container)}
        />
      </div>
      <div
        role="button"
        tabIndex={0}
        className={`font-semibold text-[15px] relative w-full p-2 pr-3 flex items-center justify-between rounded ${
          showDelete
            ? isSelected
              ? "bg-danger-200/80"
              : "opacity-60 hover:bg-danger-200/30"
            : "hover:bg-primary-100"
        } ${isMobile ? "py-3" : ""}`}
        style={{ paddingLeft }}
        onKeyDown={(e) => (e.key === "Enter" ? handleClick(item) : null)}
      >
        <div className={`flex gap-2 items-center relative`}>
          <ListCardIcon item={item} type="item" onClick={onUpdateIcon} />
          <h2
            className={`text-nowrap font-medium ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {item.name}
          </h2>
          <Favorite
            item={item}
            onClick={() => handleNestedItemFavoriteClick({ item, data })}
            showDelete={showDelete}
            size={17}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default ContainerListItemCard;
