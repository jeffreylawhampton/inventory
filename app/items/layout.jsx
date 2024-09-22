"use client";
import Search from "../components/Search";
import { usePathname } from "next/navigation";
import FilterButton from "../components/FilterButton";
import { useState, createContext } from "react";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";

export const FilterContext = createContext();

const Layout = ({ children }) => {
  const [selected, setSelected] = useState([]);
  const [opened, { open, close }] = useDisclosure();
  const pathname = usePathname();
  const showSearch = pathname.split("/").length < 3;

  return (
    <>
      {showSearch ? (
        <h1 className="text-3xl font-semibold mb-3 mt-[-2px] ">All items</h1>
      ) : null}
      <div className="mt-0 lg:mt-0">
        <FilterContext.Provider value={{ selected, opened, open, close }}>
          {showSearch ? (
            <>
              <Search />
              <FilterButton selected={selected} setSelected={setSelected} />
            </>
          ) : null}
          {children}
        </FilterContext.Provider>
        {showSearch ? (
          <CreateButton tooltipText="Create new item" onClick={open} />
        ) : null}
      </div>
    </>
  );
};

export default Layout;
