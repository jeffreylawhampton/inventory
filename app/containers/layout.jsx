"use client";
import { useState, createContext } from "react";
import { handleContainerFavoriteClick } from "./handlers";

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
        handleContainerFavoriteClick,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
