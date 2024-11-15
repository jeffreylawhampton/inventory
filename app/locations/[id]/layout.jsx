"use client";
import { useState, createContext } from "react";

export const LocationAccordionContext = createContext();

export default function Layout({ children }) {
  const [openContainers, setOpenContainers] = useState([]);
  const [openContainerItems, setOpenContainerItems] = useState([]);

  return (
    <LocationAccordionContext.Provider
      value={{
        openContainerItems,
        setOpenContainerItems,
        openContainers,
        setOpenContainers,
      }}
    >
      {children}
    </LocationAccordionContext.Provider>
  );
}
