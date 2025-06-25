import { useContext } from "react";
import {
  ColorCard,
  GridLayout,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { sortObjectArray } from "../lib/helpers";
import { DeviceContext } from "../providers";

const AllContainers = ({
  containerList,
  filter,
  handleContainerFavoriteClick,
  handleSelect,
  selectedContainers,
  showDelete,
}) => {
  const { view } = useContext(DeviceContext);
  const filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  return view ? (
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
  ) : (
    <ThumbnailGrid>
      {sortObjectArray(filteredResults)?.map((container) => {
        return (
          <ThumbnailCard
            key={container.name}
            item={container}
            type="container"
            path={`/containers/${container.id}`}
          />
        );
      })}
    </ThumbnailGrid>
  );
};

export default AllContainers;
