import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Favorite from "./Favorite";
import {
  CardMenu,
  ContainerListItemCard,
  Draggable,
  ListViewBreadcrumbs,
  PickerMenu,
  UpdateColor,
  UpdateIcon,
} from ".";
import { AccordionContext, DeviceContext, ModalContext } from "../providers";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import { ChevronDown } from "lucide-react";
import CountsPopup from "./CountsPopup";
import { checkSelected } from "../lib/helpers";

const ContainerListAccordion = ({
  container,
  data,
  handleContainerFavoriteClick,
  handleContainerClick,
  handleEditClick,
  handleEditItemClick,
  handleDeleteClick,
  handleDeleteItemClick,
  mutateKey,
  handleClick,
  isOverlay,
  activeItem,
  parentDisabled = false,
  invalidContainers,
  showLocation,
  showItemLocation,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { isMobile, width } = useContext(DeviceContext);
  const { setCurrentModal, open, close, showDelete } = useContext(ModalContext);
  const { selectedObjects, openContainers } = useContext(AccordionContext);

  const disabled = parentDisabled || invalidContainers?.includes(container.id);

  const relative = showDelete ? "" : "relative";
  const paddingLeft = container?.depth * 24;

  const isSelected = checkSelected(container, selectedObjects);

  const { isOver, setNodeRef } = useDroppable({
    id: container.id,
    data: { item: container },
    disabled,
  });

  const openModal = (component, size = "lg") => {
    setCurrentModal({ component, size });
    setPickerOpen(false);
    open();
  };

  const onUpdateColor = () => {
    openModal(
      <UpdateColor
        item={container}
        data={data}
        close={close}
        mutateKey={mutateKey}
        type={"container"}
        revalidate={false}
      />
    );
  };

  const onUpdateIcon = () => {
    openModal(
      <UpdateIcon
        item={container}
        data={data}
        close={close}
        mutateKey={mutateKey}
        type="container"
      />,
      "xl"
    );
  };

  const isOpen =
    (openContainers?.includes(container?.name) &&
      container?.containers?.length) ||
    (openContainers?.includes(container?.name) && container?.items?.length);

  return activeItem?.name === container.name ? null : (
    <Draggable
      id={container.id}
      item={container}
      type="container"
      isOverlay={isOverlay}
    >
      <div
        style={{ paddingLeft: container?.depth === 1 ? 8 : paddingLeft }}
        className={`flex !w-full items-center justify-between gap-7 p-2 pr-1 relative rounded min-h-[50px] ${
          showDelete
            ? isSelected
              ? "bg-danger-200"
              : "opacity-30 hover:bg-danger-100"
            : " hover:bg-bluegray-100"
        }  ${isOver ? "!bg-primary-400" : ""}`}
        ref={setNodeRef}
      >
        <div
          className={`w-full h-full absolute top-0 left-0 ${
            showDelete || isMobile ? "cursor-pointer" : "cursor-grab"
          }`}
          role="button"
          tabIndex={0}
          onClick={() => handleClick(container)}
        />
        <div className={`flex gap-2 items-center justify-start ${relative}`}>
          <button
            onClick={() => handleContainerClick(container)}
            disabled={
              !container?.containers?.length && !container?.items?.length
            }
            className={`[&>svg]:transition disabled:opacity-20 group ${
              isOpen ? "" : "[&>svg]:rotate-[-90deg]"
            }`}
          >
            <ChevronDown size={20} />
          </button>
          <PickerMenu
            opened={pickerOpen}
            setOpened={setPickerOpen}
            data={container}
            type={"container"}
            isCard
            handleIconPickerClick={onUpdateIcon}
            updateColorClick={onUpdateColor}
            disabled={showDelete}
            handleClick={handleClick}
          />
          <h2
            className={`font-medium text-nowrap ${
              isMobile ? "text-sm" : "text-base"
            }`}
            onClick={() => handleClick(container)}
          >
            {container.name}
          </h2>
          <Favorite
            item={container}
            onClick={
              showDelete
                ? () => handleClick(container)
                : handleContainerFavoriteClick
            }
          />
        </div>
        <div
          className={`flex gap-0.5 lg:gap-4 items-center justify-end ${relative}`}
        >
          <CountsPopup
            itemId={container.id}
            itemCount={container?.itemCount ?? container?._count?.items}
            containerCount={
              container?.containerCount ?? container?._count?.containers
            }
            showPopup={width < 560 || false}
          />

          {container?.depth > 1 || !showLocation ? null : (
            <ListViewBreadcrumbs data={container} />
          )}

          <CardMenu
            item={container}
            type={"container"}
            disabled={showDelete}
            handleEditClick={handleEditClick}
            handleColorClick={onUpdateColor}
            handleIconClick={onUpdateIcon}
            handleDeleteClick={() => handleDeleteClick(container)}
          />
        </div>
      </div>
      <Collapse in={isOpen}>
        <ul>
          {container?.items?.map((item) => {
            return (
              <ContainerListItemCard
                item={{ ...item, depth: container?.depth + 2 }}
                key={item.name}
                data={data}
                mutateKey={mutateKey}
                handleClick={handleClick}
                handleEditClick={handleEditItemClick}
                handleDeleteClick={handleDeleteItemClick}
                activeItem={activeItem}
                showLocation={showItemLocation}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}

          {container.containers?.map((childContainer) => {
            return (
              <ContainerListAccordion
                key={childContainer.name}
                container={childContainer}
                data={data}
                mutateKey={mutateKey}
                handleContainerFavoriteClick={handleContainerFavoriteClick}
                handleEditClick={handleEditClick}
                handleEditItemClick={handleEditItemClick}
                handleDeleteClick={handleDeleteClick}
                handleDeleteItemClick={handleDeleteItemClick}
                handleClick={handleClick}
                handleContainerClick={handleContainerClick}
                activeItem={activeItem}
                onUpdateColor={onUpdateColor}
                onUpdateIcon={onUpdateIcon}
                parentDisabled={disabled || !isOpen}
                showItemLocation={showItemLocation}
              />
            );
          })}
        </ul>
      </Collapse>
    </Draggable>
  );
};

export default ContainerListAccordion;
