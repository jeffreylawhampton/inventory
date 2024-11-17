"use client";
import { useState, useEffect, Suspense, createContext } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import MobileMenu from "./components/MobileMenu";
import { IconMenu2 } from "@tabler/icons-react";
import { theme } from "./lib/theme";
import "./globals.css";
import "@mantine/core/styles.css";

export const DeviceContext = createContext();

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  const [dimensions, setDimensions] = useState({ width: null, height: null });
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
            <DeviceContext.Provider value={{ isMobile, isSafari, dimensions }}>
              <Toaster />
              {isMobile ? (
                <MobileMenu open={open} close={close} opened={opened} />
              ) : (
                <Sidebar />
              )}
              <div className="mantine-tooltips" />
              <div className="lg:w-[60px] absolute left-0 top-0 bg-slate-100 h-screen z-0" />
              <div className="lg:pl-[60px] h-screen overflow-y-auto relative">
                <div className="flex w-full justify-end h-fit pt-6 px-6 lg:hidden absolute top-0 right-0">
                  <IconMenu2
                    size={30}
                    strokeWidth={2.4}
                    aria-label="Menu"
                    onClick={opened ? close : open}
                  />
                </div>
                <Suspense fallback={<Loading />}>
                  <main className="w-full px-4 xl:p-8 pt-6 pb-12">
                    {children}
                  </main>
                </Suspense>
              </div>
            </DeviceContext.Provider>{" "}
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
