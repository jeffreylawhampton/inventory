"use client";
import { useState, useEffect, Suspense, createContext } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import {
  Loading,
  MobileMenu,
  Sidebar,
  UniversalSearch,
} from "@/app/components";
import { ColorSchemeScript, MantineProvider, Modal } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";
export const DeviceContext = createContext();
export const ContainerContext = createContext();

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  const [currentModal, setCurrentModal] = useState({
    component: null,
    title: "",
    size: "lg",
  });
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [hideCarouselNav, setHideCarouselNav] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { width, height } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setDimensions({ width, height });
    setIsMobile(width < 1024);
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent : "";
    setIsSafari(/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent));
  }, [width, height]);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <ColorSchemeScript />
      </head>
      <body className="fixed w-screen h-screen antialiased">
        <UserProvider>
          <MantineProvider
            theme={theme}
            withCssVariables
            withGlobalClasses
            withStaticClasses
          >
            <DeviceContext.Provider
              value={{
                isMobile,
                isSafari,
                dimensions,
                setShowSearch,
                showMenu,
                setShowMenu,
                width,
                currentModal,
                setCurrentModal,
                opened,
                open,
                close,
                imagesToDelete,
                setImagesToDelete,
                hideCarouselNav,
                setHideCarouselNav,
              }}
            >
              <Toaster
                toastOptions={{
                  className: "font-medium",
                }}
              />

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
              <div className="relative top-0 left-0 w-full lg:left-[60px] lg:w-[calc(100vw-60px)] h-screen p-6">
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </div>

              {showSearch ? (
                <UniversalSearch
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}
                  isMobile={isMobile}
                />
              ) : null}

              <Modal
                opened={opened}
                onClose={close}
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
                  inner: "!items-end md:!items-center !px-0 lg:!p-8",
                  content: "pb-4 pt-3 px-2",
                  title: "!text-xl !font-semibold",
                }}
              >
                {currentModal.component}
              </Modal>
            </DeviceContext.Provider>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
