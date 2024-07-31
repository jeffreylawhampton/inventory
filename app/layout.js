// import { Libre_Franklin, Oswald, News_Cycle } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Providers } from "./providers";
import Loading from "./loading";
import { Suspense } from "react";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

// const news = News_Cycle({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Providers>
            <Toaster />
            <Sidebar />
            <div className="pl-[60px]">
              <Suspense fallback={<Loading />}>
                <main className="w-full p-10">
                  <NextTopLoader />
                  {children}
                </main>
              </Suspense>
            </div>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
