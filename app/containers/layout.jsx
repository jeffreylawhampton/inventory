"use client";
import { useState, createContext } from "react";

export const ContainerContext = createContext();
export default function Layout({ children }) {
  const [openContainers, setOpenContainers] = useState([]);
  const [openContainerItems, setOpenContainerItems] = useState([]);
  const [containerToggle, setContainerToggle] = useState(0);

  return (
    <ContainerContext.Provider
      value={{
        openContainers,
        setOpenContainers,
        openContainerItems,
        setOpenContainerItems,
        containerToggle,
        setContainerToggle,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
