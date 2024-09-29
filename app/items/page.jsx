"use client";
import NewItem from "./NewItem";
import useSWR from "swr";
import ItemCard from "../components/ItemCard";
import { fetcher } from "../lib/fetcher";
import { useState, useContext } from "react";
import { sortObjectArray } from "../lib/helpers";
import ItemGrid from "../components/ItemGrid";
import { FilterContext } from "./layout";
import Loading from "../components/Loading";
import SearchFilter from "../components/SearchFilter";
import FilterButton from "../components/FilterButton";
import { useDisclosure } from "@mantine/hooks";
import { Button, Pill } from "@mantine/core";
import CreateButton from "../components/CreateButton";
import CategoryPill from "../components/CategoryPill";
import { v4 } from "uuid";
import { IconMapPin } from "@tabler/icons-react";

const Page = ({ searchParams }) => {
  const [filter, setFilter] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const query = searchParams?.query || "";
  const { data, isLoading, error } = useSWR(
    `/items/api?search=${query}`,
    fetcher
  );

  // const { categoryFilters, locationFilters, opened, close } =
  //   useContext(FilterContext);

  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

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

  const locationArray = locationFilters?.map((location) => location.id);
  let itemsToShow = data?.items?.filter(
    (item) =>
      item.name?.includes(filter) ||
      item.description?.includes(filter) ||
      item.purchasedAt?.includes(filter)
  );
  if (categoryFilters?.length) {
    itemsToShow = itemsToShow.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
  }

  if (locationFilters?.length) {
    itemsToShow = itemsToShow.filter((item) =>
      locationArray.includes(item.locationId)
    );
  }

  return (
    <div className="pb-12">
      <h1 className="text-3xl font-semibold mb-3">All items</h1>
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label="Search by name, description, or purchase location"
      />
      <div className="flex gap-3 mb-2 mt-1">
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
      <div className="flex gap-2 !items-center flex-wrap mb-5 mt-3">
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
      </div>
      <ItemGrid desktop={3}>
        {sortObjectArray(itemsToShow)?.map((item) => {
          return <ItemCard key={item.name} item={item} showLocation />;
        })}
      </ItemGrid>
      <NewItem data={data} opened={opened} close={close} />
      <CreateButton tooltipText="Create new item" onClick={open} />
    </div>
  );
};

export default Page;
