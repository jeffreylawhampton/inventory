import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Favorite from "./Favorite";
import {
  CardMenu,
  ContainerListItemCard,
  Draggable,
  ListPill,
  PickerMenu,
  UpdateColor,
  UpdateIcon,
} from ".";
import { DeviceContext } from "../providers";
import { useDroppable } from "@dnd-kit/core";
import { Collapse } from "@mantine/core";
import { ChevronDown, MapPin } from "lucide-react";

const ContainerListAccordion = ({
  container,
  data,
  showDelete,
  handleContainerFavoriteClick,
  handleContainerClick,
  handleEditClick,
  handleEditItemClick,
  handleDeleteClick,
  handleDeleteItemClick,
  mutateKey,
  selectedContainers,
  setSelectedContainers,
  openContainers,
  setOpenContainers,
  handleClick,
  isOverlay,
  activeItem,
  parentDisabled = false,
  invalidContainers,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { setCurrentModal, open, close, isMobile } = useContext(DeviceContext);
  const router = useRouter();

  const disabled = parentDisabled || invalidContainers?.includes(container.id);

  const paddingLeft = container?.depth * 24;

  const isSelected = selectedContainers?.includes(container);

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
        className={`flex !w-full items-center justify-between gap-4 p-2 pr-1 relative rounded ${
          showDelete
            ? isSelected
              ? "bg-danger-200"
              : "opacity-30 hover:bg-danger-100"
            : " hover:bg-bluegray-100"
        }  ${isOver ? "!bg-primary-400" : ""}`}
        ref={setNodeRef}
      >
        <div
          className={`w-full h-full absolute top-0 left-0  ${
            showDelete || isMobile ? "cursor-pointer" : "cursor-grab"
          }`}
          role="button"
          tabIndex={0}
          onClick={() => handleClick(container)}
        />
        <div
          className={`flex gap-2 items-center justify-start relative ${
            isMobile ? "pl-6" : ""
          }`}
        >
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
            showDelete={showDelete}
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
            showDelete={showDelete}
            onClick={
              showDelete
                ? () => handleClick(container)
                : handleContainerFavoriteClick
            }
          />
        </div>
        <div className="flex gap-4 lg:gap-6 items-center justify-end relative">
          {/* <div
            className="flex gap-1 items-center justify-end"
            onClick={showDelete ? () => handleClick(container) : null}
          >
            <ListPill
              count={container?._count?.containers}
              type="container"
              showDelete={showDelete}
            />
            <ListPill
              count={container?._count?.items}
              type="item"
              showDelete={showDelete}
            />
          </div> */}
          {container?.depth > 1 ? null : (
            <div
              onClick={
                showDelete
                  ? () => handleClick(container)
                  : () =>
                      router.push(
                        `/locations?type=location&id=${
                          container?.location?.id ?? null
                        }`
                      )
              }
              className={`rounded-full flex gap-1 px-3 py-0.5 text-[11px] font-semibold justify-between items-center cursor-pointer ${
                showDelete
                  ? "bg-white/30"
                  : "bg-bluegray-100 hover:bg-bluegray-200 active:bg-bluegray-300"
              }`}
            >
              <MapPin size={12} />
              {container?.location?.name ?? "—"}
            </div>
          )}
          <div
            className="flex gap-1 items-center justify-end"
            onClick={showDelete ? () => handleClick(container) : null}
          >
            <ListPill
              count={container?._count?.containers}
              type="container"
              showDelete={showDelete}
            />
            <ListPill
              count={container?._count?.items}
              type="item"
              showDelete={showDelete}
            />
          </div>
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
                showDelete={showDelete}
                selectedContainers={selectedContainers}
                handleEditClick={handleEditItemClick}
                handleDeleteClick={handleDeleteItemClick}
                activeItem={activeItem}
              />
            );
          })}

          {container.containers?.map((childContainer) => {
            return (
              <ContainerListAccordion
                key={childContainer.name}
                container={childContainer}
                data={data}
                openContainers={openContainers}
                setOpenContainers={setOpenContainers}
                selectedContainers={selectedContainers}
                setSelectedContainers={setSelectedContainers}
                mutateKey={mutateKey}
                showDelete={showDelete}
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
              />
            );
          })}
        </ul>
      </Collapse>
    </Draggable>
  );
};

export default ContainerListAccordion;
