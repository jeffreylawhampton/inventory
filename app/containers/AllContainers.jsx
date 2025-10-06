import { useContext } from "react";
import { mutate } from "swr";
import {
  ColorCard,
  ContainerListCard,
  GridLayout,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { applySearchFilter, checkSelected } from "../lib/helpers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";
import { updateContainer } from "./api/db";
import { orderBy } from "lodash";

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
  const {
    filter,
    iconFilters,
    colorFilters,
    locationFilters,
    view,
    sortDirection,
    sortType,
  } = useContext(FilterContext);

  let overlayComponent;
  if (!view) {
    overlayComponent = ThumbnailCard;
  } else if (view === 1) {
    overlayComponent = ColorCard;
  } else {
    overlayComponent = ContainerListCard;
  }

  let filteredResults = applySearchFilter(containerList, filter);

  const locationArray = locationFilters?.map((l) => l);

  if (iconFilters?.length) {
    filteredResults = filteredResults?.filter((c) =>
      iconFilters?.includes(c.icon)
    );
  }

  if (colorFilters?.length) {
    filteredResults = filteredResults?.filter((c) =>
      colorFilters?.includes(c?.color?.hex)
    );
  }

  if (locationFilters?.length) {
    filteredResults = filteredResults.filter((c) =>
      locationArray.find((l) => l.id === c.location?.id)
    );

    if (locationFilters?.find((i) => !i.id)) {
      filteredResults = filteredResults.concat(
        data?.filter((c) => !c.locationId)
      );
    }
  }

  const results = orderBy(
    [...filteredResults],
    sortType,
    sortDirection ? "desc" : "asc"
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
      <div className="px-1.5 lg:px-3">
        {!view ? (
          <ThumbnailGrid>
            {results?.map((container) => {
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
            {results?.map((container) => {
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
      </div>
      {view === 2 ? (
        <div className="table w-max min-w-full lg:pl-1">
          {results?.map((container) => {
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
