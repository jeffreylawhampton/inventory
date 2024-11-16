"use client";
import { useState, createContext } from "react";
import { usePathname } from "next/navigation";
import CreateButton from "../components/CreateButton";
import Search from "../components/Search";
import { useDisclosure } from "@mantine/hooks";
import { Button, Pill } from "@mantine/core";
import CategoryPill from "../components/CategoryPill";
import { v4 } from "uuid";
import { IconMapPin } from "@tabler/icons-react";
import FilterButton from "../components/FilterButton";

export const FilterContext = createContext();

const Layout = ({ children }) => {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [openItems, setOpenItems] = useState([]);
  const [opened, { open, close }] = useDisclosure();
  const pathname = usePathname();
  const showSearch = pathname.split("/").length < 3;

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const onLocationClose = (id) => {
    setLocationFilters(locationFilters.filter((location) => location.id != id));
  };

  const handleClear = () => {
    setCategoryFilters([]);
    setLocationFilters([]);
  };

  return (
    <>
      {/* {showSearch ? (
        <h1 className="text-3xl font-semibold mb-3 mt-[-2px] ">All items</h1>
      ) : null} */}
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
          {/* Hidden until query bug is fixed */}
          {/* {showSearch ? (
            <>
              <Search />
              <div className="flex gap-3 mb-3 mt-2">
                <FilterButton
                  filters={categoryFilters}
                  setFilters={setCategoryFilters}
                  label="Categories"
                  type="categories"
                />

                <FilterButton
                  filters={locationFilters}
                  setFilters={setLocationFilters}
                  label="Locations"
                  type="locations"
                />
              </div>
            </>
          ) : null} */}
          {/* <div className="flex gap-2 !items-center flex-wrap mb-5">
            {categoryFilters?.map((category) => {
              return (
                <CategoryPill
                  key={v4()}
                  removable
                  category={category}
                  isCloseable={true}
                  onClose={() => onCategoryClose(category.id)}
                  size="sm"
                  showTag
                />
              );
            })}

            {locationFilters?.map((location) => {
              return (
                <Pill
                  key={v4()}
                  withRemoveButton
                  onRemove={() => onLocationClose(location.id)}
                  size="sm"
                  classNames={{
                    label: "font-semibold lg:p-1 flex gap-[2px] items-center",
                  }}
                  styles={{
                    root: {
                      height: "fit-content",
                    },
                  }}
                >
                  <IconMapPin aria-label="Category" size={16} />
                  {location?.name}
                </Pill>
              );
            })}
            {categoryFilters?.concat(locationFilters)?.length > 1 ? (
              <Button variant="subtle" onClick={handleClear} size="xs">
                Clear all
              </Button>
            ) : null}
          </div> */}

          {children}
        </FilterContext.Provider>
        {/* {showSearch ? (
          <CreateButton tooltipText="Create new item" onClick={open} />
        ) : null} */}
      </>
    </>
  );
};

export default Layout;
