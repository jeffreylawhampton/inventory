import { ColorCard, GridLayout } from "@/app/components";
import { sortObjectArray } from "../lib/helpers";

const AllContainers = ({
  containerList,
  filter,
  handleContainerFavoriteClick,
  handleSelect,
  selectedContainers,
  showDelete,
}) => {
  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  return (
    <GridLayout>
      {filteredResults?.map((container) => {
        return (
          <ColorCard
            item={container}
            type="container"
            key={container.name}
            handleFavoriteClick={handleContainerFavoriteClick}
            showDelete={showDelete}
            isSelected={selectedContainers?.includes(container.id)}
            handleSelect={handleSelect}
          />
        );
      })}
    </GridLayout>
  );
};

export default AllContainers;
