"use client";
import { useState, createContext, useContext, useRef } from "react";
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
  animateResize,
  handleDragEnd,
  handleToggleDelete,
  handleDelete,
  handleDeleteSelected,
} from "./handlers";
import { fetcher } from "../lib/fetcher";
import { IconChevronRight } from "@tabler/icons-react";
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
  const [sidebarSize, setSidebarSize] = useState(isMobile ? 40 : 10);
  const [previousSize, setPreviousSize] = useState(sidebarSize);

  const panelRef = useRef(null);
  const panel = panelRef.current;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
    // useSensor(TouchSensor, {
    //   activationConstraint: {
    //     delay: 250,
    //     tolerance: 5,
    //   },
    // })
  );

  if (isLoading) return <Loader />;

  const handleDeleteMany = () => {
    setPreviousSize(sidebarSize);
    if (isMobile) {
      sidebarSize < 50 && animateResize(sidebarSize, 70, panel);
    } else {
      sidebarSize < 30 && animateResize(sidebarSize, 30, panel);
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
    animateResize(sidebarSize, previousSize, panel);
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
      key: selectedKey,
    });
  };

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
    animateResize(sidebarSize, previousSize, panel);
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
                defaultSize={isMobile ? 40 : 25}
                collapsible
                id="left-panel"
                ref={panelRef}
                className="relative"
                onResize={(size) => setSidebarSize(size)}
                maxSize={isMobile ? 90 : 60}
              >
                {sidebarSize > 50 ? (
                  <button
                    className={`absolute z-[100] rounded-lg [&>svg]:text-bluegray-600  ${
                      isMobile
                        ? "bottom-1 left-[48%] [&>svg]:rotate-[-90deg] p-1"
                        : "top-[45%] right-1 rotate-180 active:bg-bluegray-100"
                    }`}
                    onClick={() => animateResize(sidebarSize, 0, panel)}
                  >
                    <IconChevronRight size={34} aria-label="Collapse sidebar" />
                  </button>
                ) : null}
                <ScrollArea
                  h={isMobile ? "100%" : "100vh"}
                  type="auto"
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
                  <ul className="list-none">
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
              <PanelResizeHandle
                className={`bg-transparent ${
                  isMobile
                    ? sidebarSize > 5
                      ? "h-6"
                      : "h-2"
                    : `${sidebarSize && "border-r border-bluegray-500"}`
                }`}
              >
                {isMobile && sidebarSize ? (
                  <div className="w-full h-1 bg-bluegray-200 relative top-0" />
                ) : null}
              </PanelResizeHandle>
              <Panel
                defaultSize={isMobile ? 60 : 75}
                minSize={isMobile ? 0 : 50}
                className="relative"
              >
                <div className="w-full h-full overflow-y-auto px-4 lg:px-8 pb-8 pt-3">
                  <div
                    className={`w-full h-full absolute top-0 left-0  transition-all duration-300 ${
                      showDelete ? "z-[1000] bg-black/40" : "z-[-1]"
                    }`}
                    onClick={handleCancel}
                  />
                  <Header pageData={pageData} />
                  {sidebarSize < 5 ? (
                    <button
                      className={`absolute rounded-lg [&>svg]:text-bluegray-800  ${
                        isMobile
                          ? "mt-[-50px] left-[48%] [&>svg]:rotate-90 p-1"
                          : "top-[45%] left-1 active:bg-bluegray-100"
                      }`}
                      onClick={() => animateResize(sidebarSize, 30, panel)}
                    >
                      <IconChevronRight
                        color="var(--mantine-color-bluegray-6)"
                        size={34}
                        aria-label="Expand sidebar"
                      />
                    </button>
                  ) : null}
                  {children}
                </div>
              </Panel>
            </div>
          </PanelGroup>
        </DndContext>

        <ContextMenu
          onDelete={handleDeleteMany}
          onCreateLocation={
            pageData?.type === "location" || !pageData?.name
              ? handleCreateLocation
              : null
          }
          onCreateContainer={
            pageData?.name && pageData?.type != "item"
              ? handleCreateContainer
              : null
          }
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
