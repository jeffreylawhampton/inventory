import { useState } from "react";
import ItemGrid from "../components/ItemGrid";
import ContainerCard from "../components/ContainerCard";
import { sortObjectArray } from "../lib/helpers";

const AllContainers = ({ containerList, filter }) => {
  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );
  return (
    <ItemGrid desktop={4} gap={3}>
      {filteredResults?.map((container) => {
        return <ContainerCard container={container} key={container.name} />;
      })}
    </ItemGrid>
  );
};

export default AllContainers;
