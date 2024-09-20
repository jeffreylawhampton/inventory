import { useState } from "react";
import ItemGrid from "../components/ItemGrid";
import ContainerCard from "../components/ContainerCard";
import { sortObjectArray } from "../lib/helpers";
import SearchFilter from "../components/SearchFilter";

const AllContainers = ({ containerList }) => {
  const [filter, setFilter] = useState("");

  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );
  return (
    <>
      <SearchFilter
        label={"Search for a container"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <ItemGrid desktop={4} gap={3}>
        {filteredResults?.map((container) => {
          return <ContainerCard container={container} key={container.name} />;
        })}
      </ItemGrid>
    </>
  );
};

export default AllContainers;
