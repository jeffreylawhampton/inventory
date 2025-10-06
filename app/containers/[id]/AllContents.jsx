import { useContext } from "react";
import { mutate } from "swr";
import {
  ColorCard,
  ContainerListCard,
  GridLayout,
  ListViewCard,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { checkSelected } from "@/app/lib/helpers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "@/app/providers";
import { notify } from "@/app/lib/handlers";
import { updateContainerName } from "@/app/lib/db";
import { orderBy } from "lodash";

const AllContents = ({
  filter,
  data,
  itemList,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  handleEditItemClick,
  handleEditContainerClick,
  handleDeleteClick,
  mutateKey,
  handleDeleteItemClick,
  handleClick,
}) => {
  const { width } = useContext(DeviceContext);
  const { close } = useContext(ModalContext);
  const { selectedObjects } = useContext(AccordionContext);
  const {
    categoryFilters,
    colorFilters,
    iconFilters,
    showFavorites,
    view,
    sortType,
    sortDirection,
  } = useContext(FilterContext);
  let filteredContainers = data.containers?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  let filteredItems = itemList?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter.toLowerCase())
  );

  if (categoryFilters?.length) {
    filteredContainers = [];
    filteredItems = filteredItems?.filter((i) =>
      i.categories?.some((cat) => categoryFilters.find((c) => c.id === cat.id))
    );
  }

  if (showFavorites) {
    filteredContainers = filteredContainers.filter((con) => con.favorite);
    filteredItems = filteredItems.filter((i) => i.favorite);
  }

  if (colorFilters?.length) {
    filteredItems = [];
    filteredContainers = filteredContainers?.filter((c) =>
      colorFilters?.includes(c?.color?.hex)
    );
  }

  if (iconFilters?.length) {
    filteredItems = filteredItems?.filter((i) => iconFilters?.includes(i.icon));
    filteredContainers = filteredContainers?.filter((c) =>
      iconFilters?.includes(c.icon)
    );
  }

  filteredItems = orderBy(
    filteredItems,
    sortType,
    sortDirection ? "desc" : "asc"
  );
  filteredContainers = orderBy(
    filteredContainers,
    sortType,
    sortDirection ? "desc" : "asc"
  );

  const results = filteredItems?.concat(filteredContainers);

  const handleUpdateContainer = async (updatedContainer) => {
    try {
      await mutate(
        mutateKey,
        updateContainerName({
          id: updatedContainer.id,
          name: updatedContainer.name,
        }),
        {
          optimisticData: {
            ...data,
            containers: data?.containers?.map((c) =>
              c.id === updatedContainer.id ? { ...c, ...updatedContainer } : c
            ),
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      close();
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  return (
    <>
      {!view ? (
        <ThumbnailGrid>
          {results?.map((item) => {
            const type = item?.hasOwnProperty("containerId")
              ? "item"
              : "container";
            return (
              <ThumbnailCard
                key={item.name}
                item={item}
                type={type}
                path={`/${type}s/${item.id}`}
                handleClick={handleClick}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}
        </ThumbnailGrid>
      ) : null}

      {view === 1 ? (
        <GridLayout>
          {results?.map((item) => {
            return item.hasOwnProperty("parentContainerId") ? (
              <ColorCard
                key={item.name}
                type="container"
                item={item}
                handleFavoriteClick={handleContainerFavoriteClick}
                handleClick={handleClick}
                isSelected={checkSelected(item, selectedObjects)}
              />
            ) : (
              <SquareItemCard
                key={item.name}
                item={item}
                handleFavoriteClick={handleItemFavoriteClick}
                handleClick={handleClick}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}
        </GridLayout>
      ) : null}

      {/* {view === 2 ? (
        <div className="table w-max min-w-full">
          {filteredItems?.map((item) => (
            <ListViewCard
              key={item.name}
              item={item}
              data={data}
              handleClick={handleClick}
              handleFavoriteClick={handleItemFavoriteClick}
              handleDeleteClick={handleDeleteItemClick}
              handleEditClick={handleEditItemClick}
              showLocation
              mutateKey={mutateKey}
              isSelected={checkSelected(item, selectedObjects)}
            />
          ))}

          {filteredContainers?.map((container) => {
            return (
              <ContainerListCard
                key={container.name}
                container={container}
                handleFavoriteClick={handleContainerFavoriteClick}
                handleUpdateContainer={handleUpdateContainer}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditContainerClick}
                data={data}
                handleClick={handleClick}
                showLocation
                mutateKey={mutateKey}
                width={width}
                isSelected={checkSelected(container, selectedObjects)}
              />
            );
          })}
        </div>
      ) : null} */}

      {view === 2 ? (
        <div className="table w-max min-w-full">
          {results?.map((item) => {
            return item?.hasOwnProperty("containerId") ? (
              <ListViewCard
                key={item.name}
                item={item}
                data={data}
                handleClick={handleClick}
                handleFavoriteClick={handleItemFavoriteClick}
                handleDeleteClick={handleDeleteItemClick}
                handleEditClick={handleEditItemClick}
                showLocation
                mutateKey={mutateKey}
                isSelected={checkSelected(item, selectedObjects)}
              />
            ) : (
              <ContainerListCard
                key={item.name}
                container={item}
                handleFavoriteClick={handleContainerFavoriteClick}
                handleUpdateContainer={handleUpdateContainer}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditContainerClick}
                data={data}
                handleClick={handleClick}
                showLocation
                mutateKey={mutateKey}
                width={width}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default AllContents;
