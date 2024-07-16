"use client";

import { NextUIProvider } from "@nextui-org/react";
import { createContext } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export const UserContext = createContext();
export function Providers({ children }) {
  return (
    <UserContext.Provider value={useUser()}>
      <NextUIProvider>{children}</NextUIProvider>
    </UserContext.Provider>
  );
}
