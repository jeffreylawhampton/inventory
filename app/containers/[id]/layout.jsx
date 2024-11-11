"use client";
import { useState, createContext } from "react";

export const ContainerContext = createContext();

export default function Layout({ children }) {
  const [openContainers, setOpenContainers] = useState(["Heyu"]);
  const [openContainerItems, setOpenContainerItems] = useState([]);

  return (
    <ContainerContext.Provider
      value={{
        openContainers,
        setOpenContainers,
        openContainerItems,
        setOpenContainerItems,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
