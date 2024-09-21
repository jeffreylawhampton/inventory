"use client";
import { useState, useContext } from "react";
import NewContainer from "./NewContainer";
import useSWR from "swr";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import ViewToggle from "../components/ViewToggle";
import Loading from "../components/Loading";
import { AccordionContext } from "../layout";
import AllContainers from "./AllContainers";
import Nested from "./Nested";
import LocationFilters from "./LocationFilters";
import SearchFilter from "../components/SearchFilter";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const { data, error, isLoading, mutate } = useSWR("containers", fetcher);
  const { containerToggle, setContainerToggle } = useContext(AccordionContext);
  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  let containerList = [];
  if (data?.length) {
    containerList = data;
  }

  const filtered = activeFilters?.length
    ? containerList.filter((container) =>
        activeFilters.includes(container.locationId)
      )
    : containerList;

  return (
    <div>
      <h1 className="font-bold text-3xl pb-5 ">Containers</h1>

      <ViewToggle
        active={containerToggle}
        setActive={setContainerToggle}
        data={["Nested", "All"]}
      />
      {containerToggle ? (
        <SearchFilter
          label={"Search for a container"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
      ) : null}
      <LocationFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      {containerToggle === 0 ? (
        <Nested containerList={filtered} mutate={mutate} />
      ) : (
        <AllContainers containerList={filtered} filter={filter} />
      )}

      <NewContainer
        opened={opened}
        close={close}
        containerList={containerList}
      />

      <CreateButton tooltipText="Create new container" onClick={open} />
    </div>
  );
}
