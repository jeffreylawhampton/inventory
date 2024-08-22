"use client";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Providers } from "./providers";
import Loading from "./loading";
import { Suspense } from "react";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import Breadcrumbs from "./components/Breadcrumbs";
import BottomBar from "./components/BottomBar";
import { useWindowSize } from "rooks";
import { useState, useEffect, createContext } from "react";

export const DeviceContext = createContext();

export default function RootLayout({ children }) {
  const [device, setDevice] = useState("");
  const window = useWindowSize().innerWidth;

  useEffect(() => {
    window > 769 ? setDevice("desktop") : setDevice("mobile");
  }, [window]);

  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Providers>
            <DeviceContext.Provider value={device}>
              <Toaster />
              {device === "mobile" && <BottomBar />}

              {device === "desktop" && <Sidebar />}

              <div
                className={`${device === "desktop" ? "pl-[60px]" : "pb-16"}`}
              >
                <Suspense fallback={<Loading />}>
                  <main className="w-full p-6 xl:p-8 pt-6">
                    <Breadcrumbs />

                    {children}
                  </main>
                </Suspense>
              </div>
            </DeviceContext.Provider>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
