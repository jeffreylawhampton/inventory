"use client";
import { useState, useContext } from "react";
import NewContainer from "./NewContainer";
import useSWR from "swr";
import SearchFilter from "../components/SearchFilter";
import { sortObjectArray } from "../lib/helpers";
import ContainerAccordion from "../components/ContainerAccordion";
import MasonryContainer from "../components/MasonryContainer";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import DraggableItemCard from "../components/DraggableItemCard";
import CreateButton from "../components/CreateButton";
import { moveContainerToContainer, moveItem } from "./api/db";
import { useDisclosure } from "@mantine/hooks";
import ViewToggle from "../components/ViewToggle";
import ContainerCard from "../components/ContainerCard";
import Loading from "../components/Loading";
import { AccordionContext } from "../layout";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const [activeItem, setActiveItem] = useState(null);
  const [openContainers, setOpenContainers] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("containers", fetcher);
  const { containerToggle, setContainerToggle } = useContext(AccordionContext);
  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  let containerList = [];
  if (data?.length) {
    containerList = data;
  }

  const filteredResults =
    containerToggle == 1
      ? containerList.filter((container) =>
          container?.name?.toLowerCase().includes(filter?.toLowerCase())
        )
      : sortObjectArray(containerList).filter(
          (container) => !container.parentContainerId
        );

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }
  const handleDragEnd = async (event) => {
    setActiveItem(null);
    const {
      over,
      active: {
        data: {
          current: { item },
        },
      },
    } = event;
    const destination = over?.data?.current?.item;

    if (
      item?.parentContainerId == destination?.id ||
      destination?.id === item.id
    )
      return;
    if (item?.hasOwnProperty("parentContainerId")) {
      if (!destination || destination?.id === item?.id) {
        await mutate(
          moveContainerToContainer({
            containerId: item.id,
            newContainerId: null,
          })
        );
        return;
      }

      await mutate(
        moveContainerToContainer({
          containerId: item.id,
          newContainerId: destination.id,
          newContainerLocationId: destination.locationId,
        })
      );
    } else {
      await mutate(
        moveItem({
          itemId: item.id,
          containerId: destination?.id,
          newContainerLocationId: destination?.locationId,
        })
      );
    }
  };

  const handleChange = (container) => {
    openContainers?.includes(container.name)
      ? setOpenContainers(
          openContainers?.filter((con) => con != container.name)
        )
      : setOpenContainers([...openContainers, container?.name]);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl pb-5 ">Containers</h1>
      <ViewToggle
        active={containerToggle}
        setActive={setContainerToggle}
        data={["Nested", "All"]}
      />
      {containerToggle === 1 ? (
        <SearchFilter
          label={"Search for a container"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
      ) : null}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <MasonryContainer desktopColumns={containerToggle === 1 ? 4 : 3}>
          {filteredResults?.map((container) => {
            return containerToggle === 1 ? (
              <ContainerCard container={container} key={container.name} />
            ) : (
              <ContainerAccordion
                container={container}
                activeItem={activeItem}
                key={container.name}
                handleContainerClick={handleChange}
              />
            );
          })}
        </MasonryContainer>
        <DragOverlay>
          <div className="max-w-screen overflow-hidden">
            {activeItem ? (
              activeItem.hasOwnProperty("parentContainerId") ? (
                <ContainerAccordion
                  container={activeItem}
                  openContainers={openContainers}
                  handleChange={handleChange}
                  showLocation
                />
              ) : (
                <DraggableItemCard item={activeItem} keepVisible />
              )
            ) : null}
          </div>
        </DragOverlay>
      </DndContext>
      <NewContainer
        opened={opened}
        close={close}
        containerList={containerList}
      />

      <CreateButton tooltipText="Create new container" onClick={open} />
    </div>
  );
}
