"use client";
import { useState, createContext } from "react";
export const LocationContext = createContext();

export default function Layout({ children }) {
  const [openLocations, setOpenLocations] = useState([]);
  const [openLocationItems, setOpenLocationItems] = useState([]);
  const [openContainers, setOpenContainers] = useState([]);
  const [openContainerItems, setOpenContainerItems] = useState([]);
  const [filters, setFilters] = useState([]);
  return (
    <LocationContext.Provider
      value={{
        openLocations,
        setOpenLocations,
        openLocationItems,
        setOpenLocationItems,
        openContainerItems,
        setOpenContainerItems,
        openContainers,
        setOpenContainers,
        filters,
        setFilters,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
