"use client";
import { useState, useEffect, Suspense, createContext } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import {
  Loading,
  MobileMenu,
  Sidebar,
  UniversalSearch,
} from "@/app/components";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";
import { useRouter } from "next/navigation";
export const DeviceContext = createContext();
export const LocationContext = createContext();
export const ContainerContext = createContext();

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const [openLocations, setOpenLocations] = useState([]);
  const [openContainers, setOpenContainers] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [crumbs, setCrumbs] = useState(null);
  const { width, height } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setDimensions({ width, height });
    setIsMobile(width < 1024);
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent : "";
    setIsSafari(/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent));
  }, [width, height]);

  const router = useRouter();

  const handleSelect = (item) => {
    const type = item?.hasOwnProperty("parentContainerId")
      ? "container"
      : "location";
    setSelectedItem({
      id: item.id,
      type,
    });
    router.replace(`?id=${item?.id}`);
  };

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
                crumbs,
                setCrumbs,
                setShowSearch,
                opened,
                open,
                close,
                width,
              }}
            >
              <LocationContext.Provider
                value={{
                  openLocations,
                  setOpenLocations,
                  openContainers,
                  setOpenContainers,
                  activeItem,
                  setActiveItem,
                  selectedItem,
                  setSelectedItem,
                  handleSelect,
                }}
              >
                <Toaster
                  toastOptions={{
                    className: "font-medium",
                  }}
                />

                {isMobile ? (
                  <MobileMenu open={open} close={close} opened={opened} />
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
              </LocationContext.Provider>
            </DeviceContext.Provider>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
