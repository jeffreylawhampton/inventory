import Providers from "./providers";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="fixed w-screen h-screen antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
