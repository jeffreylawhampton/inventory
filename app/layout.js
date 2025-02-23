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
import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";

export const DeviceContext = createContext();

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
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

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <ColorSchemeScript />
      </head>
      <body className="fixed w-screen h-screen">
        <UserProvider>
          <MantineProvider
            theme={theme}
            withCssVariables
            withGlobalClasses
            withStaticClasses
          >
            <DeviceContext.Provider
              value={{ isMobile, isSafari, dimensions, crumbs, setCrumbs }}
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

              <div className="lg:w-[60px] absolute left-0 top-0 bg-slate-100 h-screen z-0" />
              <div className="lg:pl-[60px] h-screen overflow-y-auto relative">
                <Suspense fallback={<Loading />}>
                  <main className="w-full px-4 xl:p-8 pt-6 pb-24 lg:pb-12">
                    <div
                      className={`w-full flex justify-between items-start gap-8 md:gap-16 lg:gap-20 xl:gap-32`}
                    >
                      <div>{crumbs}</div>
                      <div
                        className={`${
                          !width && "hidden"
                        } flex gap-3 justify-end lg:min-w-fit`}
                      >
                        <button
                          onClick={() => setShowSearch(true)}
                          className={
                            isMobile
                              ? ""
                              : "flex gap-1 bg-bluegray-100 text-bluegray-700 hover:bg-bluegray-200 hover:text-bluegray-800 rounded-lg items-center justify-end py-1 px-4 text-sm font-medium cursor-pointer"
                          }
                        >
                          <IconSearch
                            size={isMobile ? 22 : 12}
                            strokeWidth={3}
                            aria-label="Search"
                          />{" "}
                          {isMobile ? "" : "Search for anything"}
                        </button>
                        <IconMenu2
                          size={26}
                          strokeWidth={2.4}
                          className="lg:hidden"
                          aria-label="Menu"
                          onClick={opened ? close : open}
                        />
                      </div>
                    </div>
                    {children}
                  </main>
                </Suspense>
              </div>
              {showSearch ? (
                <UniversalSearch
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}
                  isMobile={isMobile}
                />
              ) : null}
            </DeviceContext.Provider>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
