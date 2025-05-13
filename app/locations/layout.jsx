"use client";
import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  MouseSensor,
  TouchSensor,
  PointerSensor,
  useSensors,
} from "@dnd-kit/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "../components";
import ContextMenu from "./ContextMenu";
import DeleteButtons from "./DeleteButtons";
import ContainerAccordion from "./sidebar/ContainerAccordion";
import ColorCard from "./detailview/ColorCard";
import DraggableItem from "./sidebar/SidebarItem";
import ItemCard from "./detailview/ItemCard";
import LocationAccordion from "./sidebar/LocationAccordion";
import NewLocation from "./forms/NewLocation";
import EditLocation from "./forms/EditLocation";
import EditContainer from "./forms/EditContainer";
import EditItem from "./forms/EditItem";
import NewContainer from "./forms/NewContainer";
import { DeviceContext } from "../layout";
import { handleDragEnd, handleToggleDelete, handleDelete } from "./handlers";
import { fetcher } from "../lib/fetcher";
import NewItem from "./forms/NewItem";

export const LocationContext = createContext();

export default function Layout({ children }) {
  const router = useRouter();
  const { data, isLoading } = useSWR("/locations/api", fetcher);
  const { isMobile } = useContext(DeviceContext);
  const [opened, { open, close, toggle }] = useDisclosure();
  const [currentModal, setCurrentModal] = useState(null);
  const [modalSize, setModalSize] = useState("lg");
  const [openLocations, setOpenLocations] = useState([]);
  const [openContainers, setOpenContainers] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [pageData, setPageData] = useState(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
      tolerance: 10,
      delay: 250,
    },
  });
  const mouseSensor = useSensor(MouseSensor);
  // const touchSensor = useSensor(TouchSensor, {
  //   activationConstraint: {
  //     delay: 300,
  //     tolerance: 4,
  //   },
  // });

  const sensors = useSensors(mouseSensor, pointerSensor);

  if (isLoading) return <Loader />;

  function handleDragStart(event) {
    const active = event.active.data.current.item;
    setActiveItem(active);
  }

  const handleCancel = () => {
    setShowDelete(false);
    setSelectedForDeletion([]);
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
    setCurrentModal(<NewLocation data={data} close={close} />);
    open();
  };

  const handleCreateItem = () => {
    setCurrentModal(<NewItem data={pageData} close={close} />);
    setModalSize(isMobile ? "xl" : "75%");
    open();
  };

  const handleCreateContainer = () => {
    setCurrentModal(<NewContainer data={pageData} close={close} />);
    setModalSize("lg");
    open();
  };

  const handleEdit = () => {
    if (pageData?.type) {
      if (pageData.type === "location") {
        setCurrentModal(<EditLocation data={pageData} close={close} />);
        setModalSize("lg");
      }

      if (pageData.type === "container") {
        setCurrentModal(<EditContainer data={pageData} close={close} />);
        setModalSize("lg");
      }
      if (pageData.type === "item") {
        setCurrentModal(<EditItem data={pageData} close={close} />);
        setModalSize(isMobile ? "xl" : "75%");
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
      key: "/locations/api/selected",
    });
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
          <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            <div
              className={`fixed top-0 left-0 w-full lg:left-[60px] lg:w-[calc(100vw-60px)] flex ${
                isMobile ? "flex-col w-screen" : ""
              } h-screen`}
            >
              <Panel defaultSize={isMobile ? 40 : 20} collapsible>
                <ScrollArea
                  h={isMobile ? "100%" : "100vh"}
                  type="scroll"
                  classNames={{
                    root: `${
                      isMobile ? "w-full h-full" : "w-full h-screen py-5"
                    }`,
                    scrollbar: "!w-[10px] !bg-slate-100",
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
                </ScrollArea>
              </Panel>
              <PanelResizeHandle className={isMobile ? "h-12" : ""}>
                <div
                  className={`relative cursor-col-resize ${
                    isMobile ? "h-[6px] w-full" : "w-[2px] h-full"
                  } bg-bluegray-300`}
                />
              </PanelResizeHandle>
              <Panel
                defaultSize={isMobile ? 50 : 80}
                minSize={isMobile ? 0 : 60}
              >
                <div className="w-full h-full overflow-y-auto p-8">
                  <Header />
                  {children}
                </div>
              </Panel>
            </div>
          </PanelGroup>
        </DndContext>

        <ContextMenu
          onDelete={() => setShowDelete(true)}
          onCreateLocation={handleCreateLocation}
          onCreateContainer={pageData?.name ? handleCreateContainer : null}
          onEdit={pageData?.name ? handleEdit : null}
          onCreateItem={
            pageData?.name && pageData?.type != "item" ? handleCreateItem : null
          }
          showRemove={false}
          currentName={pageData?.name}
          openModal={open}
          showDeleteOption
        />

        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          radius="lg"
          size={modalSize}
          yOffset={0}
          transitionProps={{
            transition: "fade",
          }}
          overlayProps={{
            blur: 4,
          }}
          classNames={{
            inner: "!items-end md:!items-center !px-0 lg:!p-8",
            content: "pb-4 pt-3 px-2",
          }}
        >
          {currentModal}
        </Modal>

        {showDelete ? (
          <DeleteButtons
            handleCancel={handleCancel}
            handleDelete={() =>
              handleDelete(
                selectedForDeletion,
                setSelectedForDeletion,
                data,
                setShowDelete,
                pageData?.type,
                pageData?.id,
                router,
                pageData
              )
            }
            count={selectedForDeletion?.length}
          />
        ) : null}
      </>
    </LocationContext.Provider>
  );
}
