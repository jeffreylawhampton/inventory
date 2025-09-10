"use client";
import { useState, useEffect, Suspense, createContext } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useSensors, useSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";
import {
  Loading,
  MobileMenu,
  Sidebar,
  UniversalSearch,
} from "@/app/components";
import { MantineProvider, Modal } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { theme } from "./lib/theme";
export const AccordionContext = createContext();
export const DeviceContext = createContext();
export const ModalContext = createContext();
export const FilterContext = createContext();
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { useKeyboardOpen } from "./hooks/useKeyboardOpen";

export default function Providers({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  const [currentModal, setCurrentModal] = useState({
    component: null,
    title: "",
    size: "lg",
  });
  const [activeItem, setActiveItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [openLocations, setOpenLocations] = useState([]);
  const [openLocationContainers, setOpenLocationContainers] = useState([]);
  const [openContainers, setOpenContainers] = useState([]);
  const [openContainerItems, setOpenContainerItems] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [containerToggle, setContainerToggle] = useState(0);
  const [hideCarouselNav, setHideCarouselNav] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [containerFilters, setContainerFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [filter, setFilter] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const [view, setView] = useState(2);
  const { width, height } = useViewportSize();
  const [viewportHeight, setViewportHeight] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const keyboardOpen = useKeyboardOpen();

  useEffect(() => {
    setDimensions({ width, height });
    setIsMobile(width < 1024);
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent : "";
    setIsSafari(/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent));
  }, [width, height]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => setViewportHeight(vv.height);

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  const handleCancel = () => {
    setSelectedObjects([]);
    setShowDelete(false);
    setShowRemove(false);
  };

  const onCloseModal = () => {
    setFilter("");
    close();
  };

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

  return (
    <>
      <UserProvider>
        <MantineProvider
          theme={theme}
          withCssVariables
          withGlobalClasses
          withStaticClasses
        >
          <Notifications />
          <ModalContext.Provider
            value={{
              activePopoverId,
              setActivePopoverId,
              currentModal,
              setCurrentModal,
              close,
              open,
              opened,
              hideCarouselNav,
              setHideCarouselNav,
              showDelete,
              setShowDelete,
              showMenu,
              setShowMenu,
              showRemove,
              setShowRemove,
              handleCancel,
            }}
          >
            <DeviceContext.Provider
              value={{
                isMobile,
                isSafari,
                dimensions,
                width,
                imagesToDelete,
                setImagesToDelete,
                sensors,
                viewportHeight,
                keyboardOpen,
              }}
            >
              <AccordionContext.Provider
                value={{
                  activeItem,
                  setActiveItem,
                  openContainers,
                  setOpenContainers,
                  openContainerItems,
                  setOpenContainerItems,
                  openLocations,
                  setOpenLocations,
                  openLocationContainers,
                  setOpenLocationContainers,
                  selectedObjects,
                  setSelectedObjects,
                }}
              >
                <FilterContext.Provider
                  value={{
                    filter,
                    setFilter,
                    showFavorites,
                    setShowFavorites,
                    categoryFilters,
                    setCategoryFilters,
                    containerFilters,
                    setContainerFilters,
                    locationFilters,
                    setLocationFilters,
                    containerToggle,
                    setContainerToggle,
                    view,
                    setView,
                    showSearch,
                    setShowSearch,
                  }}
                >
                  {isMobile ? (
                    <MobileMenu
                      open={() => setShowMenu(true)}
                      close={() => setShowMenu(false)}
                      opened={showMenu}
                    />
                  ) : (
                    <Sidebar />
                  )}
                  <div className="mantine-tooltips" />
                  <div className="relative top-0 left-0 w-full lg:left-[60px] lg:w-[calc(100vw-60px)] h-screen py-6 px-4">
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                  </div>

                  {showSearch ? <UniversalSearch /> : null}

                  <Modal
                    opened={opened}
                    onClose={onCloseModal}
                    withCloseButton={false}
                    radius="lg"
                    size={currentModal.size}
                    title={currentModal.title}
                    yOffset={0}
                    transitionProps={{
                      transition: "fade",
                    }}
                    overlayProps={{
                      blur: 4,
                    }}
                    classNames={{
                      inner:
                        "!items-end md:!items-center !px-0 lg:!p-8 !z-[220]",
                      content: "pb-4 pt-3 px-2",
                      title: "!text-xl !font-semibold",
                    }}
                    styles={{
                      root: {
                        maxHeight: keyboardOpen ? viewportHeight : null,
                        top: keyboardOpen ? 0 : null,
                      },
                    }}
                  >
                    {currentModal.component}
                  </Modal>
                </FilterContext.Provider>
              </AccordionContext.Provider>
            </DeviceContext.Provider>
          </ModalContext.Provider>
        </MantineProvider>
      </UserProvider>
    </>
  );
}
