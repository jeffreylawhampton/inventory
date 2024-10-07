import { useState } from "react";
import ItemGrid from "../components/ItemGrid";
import ContainerCard from "../components/ContainerCard";
import { sortObjectArray } from "../lib/helpers";

const AllContainers = ({ containerList, filter, handleFavoriteClick }) => {
  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
      {filteredResults?.map((container) => {
        return (
          <ContainerCard
            container={container}
            key={container.name}
            handleFavoriteClick={handleFavoriteClick}
          />
        );
      })}
    </div>
  );
};

export default AllContainers;
