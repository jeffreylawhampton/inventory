import { useContext } from "react";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import {
  ColorCard,
  ContainerListCard,
  ContainerListItemCard,
  GridLayout,
  ListViewCard,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import { sortObjectArray } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/providers";
import { notify } from "@/app/lib/handlers";
import { deleteObject, updateContainerName } from "@/app/lib/db";
import { ScrollArea } from "@mantine/core";

const AllContents = ({
  filter,
  showFavorites,
  categoryFilters,
  data,
  itemList,
  handleContainerFavoriteClick,
  handleItemFavoriteClick,
  handleEditItemClick,
  handleEditContainerClick,
  handleDeleteClick,
  mutateKey,
  handleDeleteItemClick,
  showDelete,
  handleClick,
  selectedObjects,
}) => {
  const { view, close, width } = useContext(DeviceContext);
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

  const results = sortObjectArray(filteredItems)?.concat(
    sortObjectArray(filteredContainers)
  );

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

  // const handleDeleteItemClick = async (item) => {
  //   if (!confirm(`Delete ${item.name}?`)) return;
  //   const optimisticData = structuredClone(data);

  //   optimisticData.items = optimisticData.items?.filter((i) => i.id != item.id);
  //   if (item.containerId != data.id) {
  //     optimisticData.items = optimisticData?.items?.filter(
  //       (i) => i.id != item.id
  //     );
  //     const parentContainer = optimisticData.containers?.find(
  //       (c) => c.parentContainerId === data.id
  //     );
  //     parentContainer.items = parentContainer.items.filter(
  //       (i) => i.id != item.id
  //     );
  //   }

  //   try {
  //     await mutate(
  //       mutateKey,
  //       deleteObject({
  //         id: item.id,
  //         type: "item",
  //         navigate: false,
  //       }),
  //       {
  //         optimisticData,
  //         rollbackOnError: true,
  //         populateCache: false,
  //         revalidate: true,
  //       }
  //     );
  //     await mutate("/containers/api");
  //     await mutate(`/containers/api/${item.containerId}`);
  //   } catch (e) {
  //     notify({ isError: true });
  //     throw new Error(e);
  //   }
  // };

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
                isSelected={selectedObjects?.find((i) => i.name === item.name)}
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
                isSelected={selectedObjects?.find((i) => i.name === item.name)}
              />
            ) : (
              <SquareItemCard
                key={item.name}
                item={item}
                handleFavoriteClick={handleItemFavoriteClick}
                handleClick={handleClick}
                isSelected={selectedObjects?.find((i) => i.name === item.name)}
              />
            );
          })}
        </GridLayout>
      ) : null}

      {view === 2 ? (
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
              isSelected={selectedObjects?.find((i) => i.name === item.name)}
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
                isSelected={selectedObjects?.find(
                  (c) => c.name === container.name
                )}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default AllContents;

{
  /* <ListViewCard
item={item}
data={data}
handleClick={() => router.push(`/items/${item.id}`)}
handleFavoriteClick={handleItemFavoriteClick}
handleDeleteClick={handleDeleteItemClick}
handleEditClick={handleEditItemClick}
showLocation
mutateKey={mutateKey}
/> */
}
