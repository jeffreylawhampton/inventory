import { useContext } from "react";
import { mutate } from "swr";
import {
  ColorCard,
  ContainerListCard,
  GridLayout,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import {
  buildContainerTree,
  checkSelected,
  sortObjectArray,
} from "../lib/helpers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";
import { updateContainer } from "./api/db";

const AllContainers = ({
  containerList,
  handleContainerFavoriteClick,
  handleDeleteClick,
  data,
  handleClick,
}) => {
  const { width } = useContext(DeviceContext);
  const { close } = useContext(ModalContext);
  const { selectedObjects } = useContext(AccordionContext);
  const { filter, view } = useContext(FilterContext);

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
                isSelected={checkSelected(container, selectedObjects)}
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
                isSelected={checkSelected(container, selectedObjects)}
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
                  isSelected={checkSelected(container, selectedObjects)}
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
