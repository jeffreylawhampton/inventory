"use client";
import { useState, createContext, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  AddItems,
  CloudUploadWidget,
  DeleteImages,
  EditContainer,
  EditItem,
  EditLocation,
  Loading,
  NewContainer,
  NewLocation,
  UpdateColor,
  UpdateIcon,
} from "../components";
import ContextMenu from "./ContextMenu";
import DeleteButtons from "./DeleteButtons";
import ContainerAccordion from "./sidebar/ContainerAccordion";
import ColorCard from "./detailview/ColorCard";
import DraggableItem from "./sidebar/SidebarItem";
import ItemCard from "./detailview/ItemCard";
import { AccordionContext, DeviceContext, ModalContext } from "../providers";
import {
  animateResize,
  handleDragEnd,
  handleDelete,
  handleDeleteSelected,
} from "./handlers";
import { fetcher } from "../lib/helpers";
import NewItem from "./forms/NewItem";
import EditListItem from "../items/EditListItem";
import LocationsSidebar from "./LocationsSidebar";
import DetailView from "./DetailView";

export const LocationContext = createContext();

export default function Layout({ children }) {
  const router = useRouter();
  const { data, isLoading } = useSWR("/locations/api", fetcher);

  const { isMobile, sensors } = useContext(DeviceContext);

  const {
    setCurrentModal,
    open,
    close,
    opened,
    showDelete,
    setShowDelete,
    handleCancel,
  } = useContext(ModalContext);

  const {
    activeItem,
    setActiveItem,
    openLocations,
    setOpenLocations,
    openLocationContainers,
    setOpenLocationContainers,
    selectedObjects,
    setSelectedObjects,
  } = useContext(AccordionContext);

  const [selectedKey, setSelectedKey] = useState("");
  const [pageData, setPageData] = useState(null);
  const [sidebarSize, setSidebarSize] = useState(isMobile ? 20 : 10);
  const [previousSize, setPreviousSize] = useState(sidebarSize);

  const panelRef = useRef(null);
  const panel = panelRef.current;

  if (isLoading) return <Loading />;

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

  const handleCancelDelete = () => {
    handleCancel();
    animateResize(sidebarSize, previousSize, panel);
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

  const onAddItems = () => {
    setCurrentModal({
      component: (
        <AddItems
          pageData={pageData}
          type={pageData?.type}
          close={close}
          mutateKey={selectedKey}
          additionalMutate="/locations/api"
        />
      ),
      size: isMobile ? "xl" : "90%",
      title: `Move items to ${pageData?.name}`,
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

  const handleImageDeletion = () => {
    setCurrentModal({
      component: (
        <DeleteImages item={pageData} close={close} mutateKey={selectedKey} />
      ),
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const handleUpdateColor = () => {
    setCurrentModal({
      component: (
        <UpdateColor
          data={pageData}
          type={pageData?.type}
          close={close}
          mutateKey={selectedKey}
          additionalMutate="/locations/api"
          revalidate={false}
        />
      ),
      size: isMobile ? "lg" : "md",
      title: null,
    });
    open();
  };

  const handleUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={pageData}
          type={pageData?.type}
          close={close}
          mutateKey={selectedKey}
          additionalMutate="/locations/api"
        />
      ),
      size: "xl",
      title: null,
    });
    open();
  };

  const handleUpdateItem = (item) => {
    setCurrentModal({
      component: (
        <EditListItem
          item={item}
          data={pageData}
          type={pageData?.type}
          close={close}
          mutateKey={selectedKey}
          additionalMutate="/locations/api"
          hidden={["locationId", "containerId"]}
        />
      ),
      size: isMobile ? "xl" : "75%",
      title: null,
    });
    open();
  };

  const onDragEnd = async ({ over }) => {
    return await handleDragEnd({
      over,
      activeItem,
      openLocations,
      setOpenLocations,
      openLocationContainers,
      setOpenLocationContainers,
      setActiveItem,
      data,
      key: selectedKey,
    });
  };

  const handleConfirmDelete = () => {
    handleDelete(
      selectedObjects,
      setSelectedObjects,
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
        locationList: data?.locations,
        pageData,
        setPageData,
        selectedKey,
        setSelectedKey,
        layoutData: data,
        handleUpdateColor,
        handleUpdateIcon,
        handleUpdateItem,
        sidebarSize,
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
              className={`fixed top-0 left-0 w-full lg:left-[60px] lg:w-[calc(100vw-60px)] flex  ${
                isMobile ? "flex-col w-screen" : ""
              } h-screen`}
            >
              <Panel
                defaultSize={isMobile ? 20 : 25}
                collapsible
                id="left-panel"
                ref={panelRef}
                className="relative"
                onResize={(size) => setSidebarSize(size)}
                maxSize={isMobile ? 90 : 60}
              >
                <LocationsSidebar
                  locations={data?.locations}
                  sidebarSize={sidebarSize}
                  panel={panel}
                  isMobile={isMobile}
                />
              </Panel>
              <PanelResizeHandle
                className={`!bg-transparent ${
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
                defaultSize={isMobile ? 80 : 75}
                minSize={isMobile ? 0 : 50}
                className="relative"
              >
                <DetailView
                  handleCancelDelete={handleCancelDelete}
                  isMobile={isMobile}
                  pageData={pageData}
                  sidebarSize={sidebarSize}
                  showDelete={showDelete}
                  panel={panel}
                >
                  {children}
                </DetailView>
              </Panel>
            </div>
          </PanelGroup>
        </DndContext>

        <ContextMenu
          opened={opened}
          onDelete={handleDeleteMany}
          onCreateLocation={!pageData?.name ? handleCreateLocation : null}
          onCreateContainer={
            pageData?.name && pageData?.type != "item"
              ? handleCreateContainer
              : null
          }
          onDeleteSelected={
            pageData?.id ? () => handleDeleteSelected(pageData, router) : null
          }
          onEdit={pageData?.name && pageData?.id ? handleEdit : null}
          onAdd={pageData?.type && pageData?.type != "item" ? onAddItems : null}
          onCreateItem={
            pageData?.name && pageData?.type != "item" ? handleCreateItem : null
          }
          onDeleteImages={
            pageData?.type === "item" && pageData?.images?.length
              ? handleImageDeletion
              : null
          }
          onUpload={pageData?.type === "item"}
          showRemove={false}
          currentName={pageData?.name}
          openModal={open}
          showDeleteOption
          router={router}
        />

        {pageData?.type === "item" ? (
          <CloudUploadWidget item={pageData} mutateKey={selectedKey}>
            {({ open }) => (
              <button
                id="cloud-upload-trigger"
                style={{ display: "none" }}
                onClick={() => open()}
              />
            )}
          </CloudUploadWidget>
        ) : null}

        {showDelete ? (
          <DeleteButtons
            handleCancel={handleCancelDelete}
            handleDelete={handleConfirmDelete}
            count={selectedObjects?.length}
          />
        ) : null}
      </>
    </LocationContext.Provider>
  );
}
