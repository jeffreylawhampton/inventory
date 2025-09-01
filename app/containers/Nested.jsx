import { useState, useContext, useEffect } from "react";
import {
  ContainerAccordion,
  ContainerListAccordion,
  ContainerListItemCard,
  MasonryContainer,
} from "@/app/components";
import {
  getDescendants,
  handleToggleSelect,
  sortObjectArray,
} from "../lib/helpers";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { buildContainerTree } from "../lib/helpers";
import { handleDragEnd } from "./handlers";
import { AccordionContext, DeviceContext, FilterContext } from "../providers";
import { ScrollArea } from "@mantine/core";

const Nested = ({
  data,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  handleEditClick,
  handleEditItemClick,
  mutateKey,
  handleDeleteClick,
  handleDeleteItemClick,
  handleClick,
}) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [invalidContainers, setInvalidContainers] = useState([]);
  const { view, setView } = useContext(FilterContext);
  const { isMobile, sensors } = useContext(DeviceContext);

  useEffect(() => {
    setFilteredResults(sortObjectArray(buildContainerTree(data)));
  }, [data]);

  useEffect(() => {
    if (!view) {
      setView(2);
    }
  }, [view, setView]);

  const {
    activeItem,
    setActiveItem,
    openContainers,
    setOpenContainers,
    openContainerItems,
    setOpenContainerItems,
  } = useContext(AccordionContext);

  const handleContainerClick = (container) => {
    handleToggleSelect(container?.name, openContainers, setOpenContainers);
  };

  function handleDragStart(event) {
    const active = event.active?.data?.current?.item;

    const descendants = getDescendants(data, active?.id);
    const descendantIds = descendants.map((c) => c.id);
    setInvalidContainers(descendantIds);

    setActiveItem(active);
  }

  const onDragEnd = async ({ over }) => {
    return await handleDragEnd({
      over,
      activeItem,
      openContainers,
      setOpenContainers,
      openContainerItems,
      setOpenContainerItems,
      setActiveItem,
      data,
      mutateKey,
      view,
      setFilteredResults,
      buildContainerTree,
      invalidContainers,
    });
  };

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        collisionDetection={pointerWithin}
        sensors={sensors}
      >
        {view === 1 ? (
          <div className="px-1.5 lg:px-3">
            <MasonryContainer desktopColumns={3}>
              {filteredResults?.map((container) => {
                return activeItem?.name === container.name ? null : (
                  <ContainerAccordion
                    container={container}
                    activeItem={activeItem}
                    data={data}
                    mutateKey={mutateKey}
                    key={container.name}
                    showLocation
                    handleContainerClick={handleContainerClick}
                    handleClick={handleClick}
                    handleItemFavoriteClick={handleItemFavoriteClick}
                    handleContainerFavoriteClick={handleContainerFavoriteClick}
                    handleEditItemClick={handleEditItemClick}
                    handleDeleteItemClick={handleDeleteItemClick}
                    bgColor="!bg-bluegray-100"
                    shadow="!drop-shadow-xl"
                    disabled={false}
                  />
                );
              })}
            </MasonryContainer>
          </div>
        ) : (
          <ScrollArea
            w="100%"
            scrollbars="x"
            type="scroll"
            offsetScrollbars="x"
            classNames={{
              root: "list !text-[15px] font-medium ",
            }}
          >
            <div className="table min-w-full">
              {filteredResults?.map((container) => {
                return activeItem?.name === container.name ||
                  invalidContainers?.includes(container?.id) ? null : (
                  <div className="table-row" key={container.name}>
                    <ContainerListAccordion
                      container={container}
                      handleContainerClick={handleContainerClick}
                      handleEditClick={handleEditClick}
                      handleEditItemClick={handleEditItemClick}
                      handleClick={handleClick}
                      handleItemFavoriteClick={handleItemFavoriteClick}
                      handleDeleteClick={handleDeleteClick}
                      handleDeleteItemClick={handleDeleteItemClick}
                      handleContainerFavoriteClick={
                        handleContainerFavoriteClick
                      }
                      data={data}
                      mutateKey={mutateKey}
                      activeItem={activeItem}
                      parentDisabled={false}
                      invalidContainers={invalidContainers}
                      showLocation
                      showItemLocation={false}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        <DragOverlay>
          <div className="max-w-screen overflow-hidden">
            {activeItem ? (
              activeItem.hasOwnProperty("parentContainerId") ? (
                view === 1 ? (
                  <ContainerAccordion container={activeItem} showLocation />
                ) : (
                  <ContainerListAccordion container={activeItem} isOverlay />
                )
              ) : (
                <ContainerListItemCard
                  item={activeItem}
                  showLocation={false}
                  hideTags={isMobile || view === 1}
                />
              )
            ) : null}
          </div>
        </DragOverlay>
        <div className="h-full relative w-full z-100" />
      </DndContext>
    </>
  );
};

export default Nested;
