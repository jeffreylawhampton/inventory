import { useContext, useEffect } from "react";
import {
  ContainerAccordion,
  ContainerListAccordion,
  ContainerListItemCard,
  Loading,
  MasonryContainer,
} from "@/app/components";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import {
  checkSelected,
  buildContainerTree,
  handleToggleSelect,
  sortObjectArray,
} from "@/app/lib/helpers";
import { moveItem, moveContainerToContainer } from "../api/db";
import { mutate } from "swr";
import { mutateProps, notify } from "@/app/lib/handlers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
} from "@/app/providers";
import { ScrollArea } from "@mantine/core";
import { handleAwaitOpen } from "../handlers";

const Nested = ({
  data,
  isLoading,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  mutateKey,
  handleEditItemClick,
  handleEditContainerClick,
  handleDeleteItemClick,
  handleClick,
}) => {
  const { view, setView } = useContext(FilterContext);
  const { isMobile, sensors } = useContext(DeviceContext);
  const {
    activeItem,
    setActiveItem,
    openContainers,
    setOpenContainers,
    setOpenContainerItems,
    openContainerItems,
    selectedObjects,
  } = useContext(AccordionContext);

  let results = buildContainerTree(
    sortObjectArray([...data?.containers]),
    data?.id
  );

  useEffect(() => {
    if (!view) {
      setView(2);
    }
  }, [view, setView]);

  const handleMoveContainer = async (source, destination) => {
    const optimisticData = {
      ...data,
      containers: data?.containers?.map((c) =>
        c.id === source.id
          ? {
              ...c,
              parentContainer: destination ?? data,
              parentContainerId: destination?.id ?? data.id,
            }
          : { ...c }
      ),
    };
    await handleAwaitOpen(
      destination,
      openContainers,
      setOpenContainers,
      openContainerItems,
      setOpenContainerItems,
      view
    );
    await mutate(
      mutateKey,
      moveContainerToContainer({
        containerId: source.id,
        newContainerId: destination?.id ?? data.id,
        newContainerLocationId: destination?.locationId ?? null,
      }),
      {
        optimisticData,
        ...mutateProps,
      }
    );
  };

  const handleMoveItem = async (source, destination) => {
    if (source.containerId === data.id && destination.id === data.id)
      return setActiveItem(null);

    let updatedItems = [...(data?.items || [])];
    const optimisticData = {
      ...data,
      containers: data?.containers?.map((c) => {
        let updatedContainer = { ...c };

        if (c.id === source.containerId) {
          updatedContainer = {
            ...updatedContainer,
            items: updatedContainer.items?.filter((i) => i.id !== source.id),
          };
        }

        if (c.id === destination.id) {
          updatedContainer = {
            ...updatedContainer,
            items: sortObjectArray([
              ...updatedContainer.items,
              {
                ...source,
                containerId: destination.id,
                container: {
                  name: destination?.name ?? data.name,
                  id: destination?.id ?? data.id,
                },
              },
            ]),
          };
        }

        return updatedContainer;
      }),
      items: (() => {
        if (destination.id === data.id) {
          return sortObjectArray([
            ...updatedItems,
            { ...source, containerId: data.id, depth: 1 },
          ]);
        } else if (source.containerId === data.id) {
          return updatedItems.filter((i) => i.id !== source.id);
        } else {
          return updatedItems;
        }
      })(),
    };

    if (source?.containerId === data.id) {
      optimisticData.items = sortObjectArray(
        optimisticData.items?.filter((i) => i.id != source.id)
      );
    }

    await handleAwaitOpen(
      destination,
      openContainers,
      setOpenContainers,
      openContainerItems,
      setOpenContainerItems,
      view
    );

    await mutate(
      mutateKey,
      moveItem({
        itemId: source.id,
        containerId: destination.id,
        containerLocationId: destination.locationId ?? null,
      }),
      {
        optimisticData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false,
      }
    );
    mutate(mutateKey);
  };

  function handleDragStart(event) {
    const active = event.active.data.current.item;
    setActiveItem(active);
  }

  const handleDragEnd = async ({ over, view }) => {
    const destination = over?.data?.current?.item ?? data;
    const source = { ...activeItem };

    destination &&
      (await handleAwaitOpen(
        destination,
        openContainers,
        setOpenContainers,
        openContainerItems,
        setOpenContainerItems,
        view
      ));

    try {
      const moveFunction =
        source.type === "item" ? handleMoveItem : handleMoveContainer;
      moveFunction(source, destination);
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    } finally {
      setActiveItem(null);
    }
  };

  const handleContainerClick = (container) => {
    handleToggleSelect(container?.name, openContainers, setOpenContainers);
  };

  if (isLoading) return <Loading />;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
      sensors={sensors}
    >
      {view === 1 ? (
        <MasonryContainer>
          {data?.items?.map((item) => {
            return activeItem?.name === item.name ||
              item?.containerId != data?.id ? null : (
              <ContainerListItemCard
                key={item.name}
                item={item}
                data={data}
                activeItem={activeItem}
                mutateKey={mutateKey}
                handleEditClick={handleEditItemClick}
                handleDeleteClick={handleDeleteItemClick}
                handleClick={handleClick}
                showLocation={false}
                hideTags
                bgColor="bg-bluegray-100/60"
                isSelected={checkSelected(item, selectedObjects)}
                isAccordion
              />
            );
          })}

          {results?.map((container) => {
            return activeItem?.name === container.name ? null : (
              <ContainerAccordion
                key={container?.name}
                container={container}
                bgColor="!bg-bluegray-200"
                data={data}
                mutateKey={mutateKey}
                activeItem={activeItem}
                handleContainerFavoriteClick={handleContainerFavoriteClick}
                handleEditItemClick={handleEditItemClick}
                handleItemFavoriteClick={handleItemFavoriteClick}
                handleDeleteItemClick={handleDeleteItemClick}
                handleContainerClick={handleContainerClick}
                handleClick={handleClick}
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
          <div className="table w-max min-w-full">
            {data?.items
              ?.filter((i) => i.containerId === data.id)
              ?.map((item) => {
                return activeItem?.name === item.name ? null : (
                  <div className="table-row" key={item.name}>
                    <ContainerListItemCard
                      item={item}
                      data={data}
                      activeItem={activeItem}
                      mutateKey={mutateKey}
                      handleEditClick={handleEditItemClick}
                      handleDeleteClick={handleDeleteItemClick}
                      handleClick={handleClick}
                      showLocation={false}
                      isSelected={selectedObjects.find(
                        (i) => i.name === item.name
                      )}
                    />
                  </div>
                );
              })}
            {results?.map((container) => {
              return activeItem?.name === container?.name ? null : (
                <div className="table-row" key={container.name}>
                  <ContainerListAccordion
                    container={container}
                    handleContainerClick={handleContainerClick}
                    handleItemFavoriteClick={handleItemFavoriteClick}
                    handleContainerFavoriteClick={handleContainerFavoriteClick}
                    handleDeleteItemClick={handleDeleteItemClick}
                    handleEditClick={handleEditContainerClick}
                    handleEditItemClick={handleEditItemClick}
                    handleClick={handleClick}
                    data={data}
                    mutateKey={mutateKey}
                    activeItem={activeItem}
                    showLocation={false}
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
          {activeItem?.hasOwnProperty("parentContainerId") ? (
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
              hideTags={isMobile || view === 1}
              showLocation={false}
            />
          )}
        </div>
      </DragOverlay>
    </DndContext>
  );
};

export default Nested;
