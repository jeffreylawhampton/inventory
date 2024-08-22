"use client";
import { NextUIProvider } from "@nextui-org/react";
import { PrimeReactProvider } from "primereact/api";
import { useRouter } from "next/navigation";

export function Providers({ children }) {
  const router = useRouter();

  return (
    <PrimeReactProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </PrimeReactProvider>
  );
}
