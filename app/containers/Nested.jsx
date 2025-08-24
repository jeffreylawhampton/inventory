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
import {
  DndContext,
  pointerWithin,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { buildContainerTree } from "../lib/helpers";
import { handleDragEnd } from "./handlers";
import { ContainerContext } from "./layout";
import { DeviceContext } from "../providers";
import { ScrollArea } from "@mantine/core";

const Nested = ({
  data,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  handleEditClick,
  handleEditItemClick,
  handleSelect,
  selectedContainers,
  setSelectedContainers,
  mutateKey,
  handleDeleteClick,
  handleDeleteItemClick,
  handleClick,
  isMobile,
}) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [invalidContainers, setInvalidContainers] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const { view, setView, showDelete } = useContext(DeviceContext);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: showDelete ? 5000 : 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        tolerance: showDelete ? 5000 : 5,
        delay: 225,
      },
    })
  );

  useEffect(() => {
    setFilteredResults(sortObjectArray(buildContainerTree(data)));
  }, [data]);

  useEffect(() => {
    if (!view) {
      setView(2);
    }
  }, [view, setView]);

  const {
    openContainers,
    setOpenContainers,
    openContainerItems,
    setOpenContainerItems,
  } = useContext(ContainerContext);

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
                  handleSelect={handleSelect}
                  handleClick={handleClick}
                  handleItemFavoriteClick={handleItemFavoriteClick}
                  handleContainerFavoriteClick={handleContainerFavoriteClick}
                  handleEditItemClick={handleEditItemClick}
                  handleDeleteItemClick={handleDeleteItemClick}
                  openContainers={openContainers}
                  setOpenContainers={setOpenContainers}
                  openContainerItems={openContainerItems}
                  setOpenContainerItems={setOpenContainerItems}
                  selectedContainers={selectedContainers}
                  bgColor="!bg-bluegray-100"
                  shadow="!drop-shadow-xl"
                  disabled={false}
                />
              );
            })}
          </MasonryContainer>
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
                      selectedContainers={selectedContainers}
                      setSelectedContainers={setSelectedContainers}
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
                      openContainers={openContainers}
                      setOpenContainers={setOpenContainers}
                      openContainerItems={openContainerItems}
                      setOpenContainerItems={setOpenContainerItems}
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
                  <ContainerAccordion
                    container={activeItem}
                    showLocation
                    openContainers={openContainers}
                    openContainerItems={openContainerItems}
                  />
                ) : (
                  <ContainerListAccordion
                    container={activeItem}
                    openContainers={openContainers}
                    isOverlay
                  />
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
