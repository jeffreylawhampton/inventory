"use client";
import { useState, useEffect, Suspense, createContext } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import {
  Loading,
  MobileMenu,
  Sidebar,
  UniversalSearch,
} from "@/app/components";
import { Button, ColorSchemeScript, MantineProvider } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Toaster } from "react-hot-toast";
import { IconMenu2 } from "@tabler/icons-react";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";
import SearchIcon from "./assets/SearchIcon";

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
      <body className="fixed w-screen h-screen antialiased">
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
                  <main className="w-full px-4 xl:px-8 pt-4 pb-24 lg:pb-12">
                    <div
                      className={`w-full flex justify-between items-start gap-8 md:gap-16 lg:gap-20 xl:gap-32`}
                    >
                      <div className="mt-1">{crumbs}</div>
                      <div
                        className={`${
                          !width && "hidden"
                        } flex gap-2 items-center justify-end lg:min-w-fit`}
                      >
                        <Button
                          component="a"
                          href="/api/auth/logout"
                          size="xs"
                          classNames={{
                            root: "!hidden lg:!block !bg-black",
                            label: "text-sm",
                          }}
                        >
                          Log out
                        </Button>
                        <Button
                          onClick={() => setShowSearch(true)}
                          size={isMobile ? "compact-lg" : "xs"}
                          classNames={{
                            label: "text-sm",
                            root: "!px-2",
                          }}
                          variant={isMobile ? "subtle" : "outline"}
                          color="black"
                        >
                          <span className="flex gap-1">
                            <SearchIcon
                              fill="black"
                              classes="w-6 lg:w-[14px]"
                            />
                            <span className="hidden lg:block">Search</span>
                          </span>
                        </Button>
                        {isMobile ? (
                          <Button
                            onClick={opened ? close : open}
                            classNames={{ root: "!px-1" }}
                            variant="subtle"
                            size="compact-lg"
                            color="black"
                          >
                            <IconMenu2
                              size={32}
                              strokeWidth={2.4}
                              className="lg:hidden"
                              aria-label="Menu"
                              onClick={opened ? close : open}
                            />
                          </Button>
                        ) : null}
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
