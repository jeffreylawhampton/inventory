"use client";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
} from "@dnd-kit/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea, Loader } from "@mantine/core";
import {
  EditContainer,
  Header,
  NewContainer,
  NewLocation,
  EditLocation,
  EditItem,
} from "../components";
import ContextMenu from "./ContextMenu";
import DeleteButtons from "./DeleteButtons";
import ContainerAccordion from "./sidebar/ContainerAccordion";
import ColorCard from "./detailview/ColorCard";
import DraggableItem from "./sidebar/SidebarItem";
import ItemCard from "./detailview/ItemCard";
import LocationAccordion from "./sidebar/LocationAccordion";
import { DeviceContext } from "../layout";
import {
  handleDragEnd,
  handleToggleDelete,
  handleDelete,
  handleDeleteSelected,
} from "./handlers";
import { fetcher } from "../lib/fetcher";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import NewItem from "./forms/NewItem";

export const LocationContext = createContext();

export default function Layout({ children }) {
  const router = useRouter();
  const { data, isLoading } = useSWR("/locations/api", fetcher);
  const { isMobile, setCurrentModal, open, close } = useContext(DeviceContext);
  const [selectedKey, setSelectedKey] = useState("");
  const [openLocations, setOpenLocations] = useState([]);
  const [openContainers, setOpenContainers] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [sidebarSize, setSidebarSize] = useState(isMobile ? 40 : 20);
  const [previousSize, setPreviousSize] = useState(sidebarSize);

  const panelRef = useRef(null);
  const panel = panelRef.current;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  if (isLoading) return <Loader />;

  const handleDeleteMany = () => {
    setPreviousSize(sidebarSize);
    if (isMobile) {
      sidebarSize < 50 && animateResize(sidebarSize, 70);
    } else {
      sidebarSize < 30 && animateResize(sidebarSize, 30);
    }
    setShowDelete(true);
  };

  const handleDragStart = (event) => {
    const active = event.active.data.current.item;
    setActiveItem(active);
  };

  const handleCancel = () => {
    setShowDelete(false);
    setSelectedForDeletion([]);
    animateResize(sidebarSize, previousSize);
  };

  const handleSelectForDeletion = (item) => {
    handleToggleDelete(
      item,
      "name",
      selectedForDeletion,
      setSelectedForDeletion
    );
  };

  const handleCreateLocation = () => {
    setCurrentModal({
      component: (
        <NewLocation data={data} close={close} mutateKey={selectedKey} />
      ),
      size: "lg",
    });
    open();
  };

  const handleCreateItem = () => {
    setCurrentModal({
      component: <NewItem data={pageData} close={close} />,
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const handleCreateContainer = () => {
    setCurrentModal({
      component: (
        <NewContainer
          data={pageData}
          close={close}
          mutateKey={selectedKey}
          hidden={["locationId", "containerId"]}
        />
      ),
      title: "Create new container",
      size: "lg",
    });
    open();
  };

  const handleEdit = () => {
    if (pageData?.type) {
      if (pageData.type === "location") {
        setCurrentModal({
          component: (
            <EditLocation
              data={pageData}
              close={close}
              mutateKey={selectedKey}
            />
          ),
          size: "lg",
        });
      }

      if (pageData.type === "container") {
        setCurrentModal({
          component: (
            <EditContainer
              data={pageData}
              close={close}
              mutateKey={selectedKey}
            />
          ),
          size: "lg",
        });
      }
      if (pageData.type === "item") {
        setCurrentModal({
          component: (
            <EditItem
              data={pageData}
              close={close}
              mutateKey={selectedKey}
              additionalMutate={"/locations/api"}
            />
          ),
          size: isMobile ? "xl" : "75%",
        });
      }
      open();
    }
  };

  const onDragEnd = async ({ over }) => {
    return await handleDragEnd({
      over,
      activeItem,
      openLocations,
      setOpenLocations,
      openContainers,
      setOpenContainers,
      setActiveItem,
      data,
      key: "/locations/api/selected?",
    });
  };

  const animateResize = (from, to, duration = 300) => {
    if (!panel) return;

    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentSize = from + (to - from) * easeOutCubic(progress);

      panel.resize(currentSize);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const handleConfirmDelete = () => {
    handleDelete(
      selectedForDeletion,
      setSelectedForDeletion,
      data,
      setShowDelete,
      pageData?.type,
      pageData?.id,
      router,
      pageData
    );
    animateResize(sidebarSize, previousSize);
  };

  return (
    <LocationContext.Provider
      value={{
        setCurrentModal,
        openLocations,
        setOpenLocations,
        openContainers,
        setOpenContainers,
        activeItem,
        setActiveItem,
        locationList: data?.locations,
        showDelete,
        setShowDelete,
        selectedForDeletion,
        setSelectedForDeletion,
        handleSelectForDeletion,
        pageData,
        setPageData,
        selectedKey,
        setSelectedKey,
        layoutData: data,
      }}
    >
      <>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={pointerWithin}
          sensors={sensors}
        >
          <DragOverlay>
            {activeItem?.type === "container" ? (
              activeItem?.sidebar ? (
                <ContainerAccordion container={activeItem} isOverlay />
              ) : (
                <ColorCard container={activeItem} isOverlay />
              )
            ) : activeItem?.sidebar ? (
              <DraggableItem item={activeItem} isOverlay />
            ) : (
              <ItemCard item={activeItem} isOverlay />
            )}
          </DragOverlay>
          <PanelGroup
            direction={isMobile ? "vertical" : "horizontal"}
            id="group"
          >
            <div
              className={`fixed top-0 left-0 w-full lg:left-[60px] lg:w-[calc(100vw-60px)] flex ${
                isMobile ? "flex-col w-screen" : ""
              } h-screen`}
            >
              <Panel
                defaultSize={sidebarSize}
                collapsible
                id="left-panel"
                ref={panelRef}
                onResize={(size) => setSidebarSize(size)}
              >
                <ScrollArea
                  h={isMobile ? "100%" : "100vh"}
                  type={isMobile ? "auto" : "scroll"}
                  scrollbars="xy"
                  classNames={{
                    root: `relative ${
                      isMobile ? "w-full h-full" : "w-full h-screen py-5"
                    }`,
                    scrollbar: `
                    ${
                      isMobile
                        ? "!bottom-2 z-100 absolute data-[orientation=horizontal]:!h-[20px] data-[orientation=vertical]:!w-[20px] !bg-slate-100"
                        : ""
                    }`,
                  }}
                >
                  <ul className="list-none [&>li]:mb-1">
                    {data?.locations?.map((location) => {
                      return (
                        <LocationAccordion
                          key={location?.name}
                          location={location}
                        />
                      );
                    })}
                  </ul>
                  {isMobile ? <div className="h-8" /> : null}
                </ScrollArea>
              </Panel>
              <PanelResizeHandle className={isMobile ? "h-12 relative" : ""}>
                <div
                  className={`relative cursor-col-resize ${
                    isMobile ? "h-[4px] w-full" : "w-[2px] h-full"
                  } bg-bluegray-300`}
                />
                {isMobile ? (
                  <IconChevronDown
                    size={26}
                    strokeWidth={3}
                    className="absolute top-2 left-[45%] text-bluegray-400"
                  />
                ) : null}
              </PanelResizeHandle>
              <Panel
                defaultSize={isMobile ? 50 : 80}
                minSize={isMobile ? 0 : 60}
              >
                <div className="w-full h-full overflow-y-auto px-5 lg:px-8 pb-8 pt-0 lg:pt-6">
                  <Header />

                  {children}
                </div>
              </Panel>
            </div>
          </PanelGroup>
        </DndContext>

        <ContextMenu
          onDelete={handleDeleteMany}
          onCreateLocation={handleCreateLocation}
          onCreateContainer={pageData?.name ? handleCreateContainer : null}
          onDeleteSelected={
            pageData?.id ? () => handleDeleteSelected(pageData, router) : null
          }
          onEdit={pageData?.name && pageData?.id ? handleEdit : null}
          onCreateItem={
            pageData?.name && pageData?.type != "item" ? handleCreateItem : null
          }
          showRemove={false}
          currentName={pageData?.name}
          openModal={open}
          showDeleteOption
          router={router}
        />

        {showDelete ? (
          <DeleteButtons
            handleCancel={handleCancel}
            handleDelete={handleConfirmDelete}
            count={selectedForDeletion?.length}
          />
        ) : null}
      </>
    </LocationContext.Provider>
  );
}
