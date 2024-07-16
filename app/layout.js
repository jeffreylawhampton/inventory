import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Sidebar from "./components/Sidebar";
import { Providers } from "./providers";
import Loading from "./loading";
import { Suspense } from "react";

const libre = Libre_Franklin({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={libre.className}>
        <UserProvider>
          <Providers>
            <Sidebar />
            <Suspense fallback={<Loading />}>
              <main className="ml-20 pt-8 min-h-screen">{children}</main>
            </Suspense>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
