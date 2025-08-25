import { useContext } from "react";
import { mutate } from "swr";
import {
  ColorCard,
  ContainerListCard,
  GridLayout,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { buildContainerTree, sortObjectArray } from "../lib/helpers";
import { DeviceContext } from "../providers";
import { updateContainer } from "./api/db";

const AllContainers = ({
  containerList,
  filter,
  handleContainerFavoriteClick,
  handleDeleteClick,
  handleSelect,
  selectedContainers,
  data,
  handleClick,
}) => {
  const { view, close, width } = useContext(DeviceContext);

  let overlayComponent;
  if (!view) {
    overlayComponent = ThumbnailCard;
  } else if (view === 1) {
    overlayComponent = ColorCard;
  } else {
    overlayComponent = ContainerListCard;
  }

  let filteredResults = buildContainerTree(containerList);

  filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  const handleUpdateContainer = async (container) => {
    try {
      await mutate("/containers/api", updateContainer(container), {
        optimisticData: data?.map((c) =>
          c.id === container?.id ? { ...c, ...container } : c
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      close();
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <>
      {!view ? (
        <ThumbnailGrid>
          {sortObjectArray(filteredResults)?.map((container) => {
            return (
              <ThumbnailCard
                item={container}
                key={container.name}
                type="container"
                path={`/containers/${container.id}`}
                isSelected={selectedContainers?.find(
                  (c) => c.name === container.name
                )}
                handleSelect={handleSelect}
                handleClick={handleClick}
              />
            );
          })}
        </ThumbnailGrid>
      ) : null}

      {view === 1 ? (
        <GridLayout>
          {filteredResults?.map((container) => {
            return (
              <ColorCard
                item={container}
                type="container"
                key={container.name}
                handleFavoriteClick={handleContainerFavoriteClick}
                isSelected={selectedContainers?.find(
                  (c) => c.name === container.name
                )}
                handleSelect={handleSelect}
                handleClick={handleClick}
              />
            );
          })}
        </GridLayout>
      ) : null}

      {view === 2 ? (
        <div className="table w-max min-w-full">
          {filteredResults?.map((container) => {
            return (
              <div className="table-row" key={container.name}>
                <ContainerListCard
                  container={container}
                  handleClick={handleClick}
                  data={data}
                  showLocation
                  handleFavoriteClick={handleContainerFavoriteClick}
                  handleDeleteClick={handleDeleteClick}
                  handleUpdateContainer={handleUpdateContainer}
                  mutateKey="/containers/api"
                  width={width}
                  isSelected={selectedContainers?.find(
                    (c) => c.name === container.name
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default AllContainers;
