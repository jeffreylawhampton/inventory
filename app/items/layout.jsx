"use client";
import { useState, createContext } from "react";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/Header";

export const FilterContext = createContext();

const Layout = ({ children }) => {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [openItems, setOpenItems] = useState([]);
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Header />

      <>
        <FilterContext.Provider
          value={{
            openItems,
            setOpenItems,
            categoryFilters,
            locationFilters,
            opened,
            open,
            close,
          }}
        >
          {children}
        </FilterContext.Provider>
      </>
    </>
  );
};

export default Layout;
