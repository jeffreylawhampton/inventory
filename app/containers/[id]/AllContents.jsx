import { useContext } from "react";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import {
  ColorCard,
  ContainerListCard,
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
}) => {
  const router = useRouter();
  const { view, close } = useContext(DeviceContext);
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

  const handleDeleteItemClick = async (item) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    const optimisticData = structuredClone(data);

    optimisticData.items = optimisticData.items?.filter((i) => i.id != item.id);
    if (item.containerId != data.id) {
      optimisticData.items = optimisticData?.items?.filter(
        (i) => i.id != item.id
      );
      const parentContainer = optimisticData.containers?.find(
        (c) => c.parentContainerId === data.id
      );
      parentContainer.items = parentContainer.items.filter(
        (i) => i.id != item.id
      );
    }

    try {
      await mutate(
        mutateKey,
        deleteObject({
          id: item.id,
          type: "item",
          navigate: false,
        }),
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      await mutate("/containers/api");
      await mutate(`/containers/api/${item.containerId}`);
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
                handleClick={() => router.push(`/${type}s/${item.id}`)}
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
                handleClick={() => router.push(`/containers/${item.id}`)}
              />
            ) : (
              <SquareItemCard
                key={item.name}
                item={item}
                handleFavoriteClick={handleItemFavoriteClick}
                handleClick={() => router.push(`/items/${item.id}`)}
              />
            );
          })}
        </GridLayout>
      ) : null}

      {view === 2 ? (
        <ScrollArea
          w="100%"
          scrollbars="x"
          type="hover"
          offsetScrollbars="x"
          classNames={{
            root: "list !text-[15px] font-medium ",
          }}
        >
          <div className="table w-max min-w-full">
            {filteredItems?.map((item) => (
              <div className="table-row" key={item.name}>
                <ListViewCard
                  item={item}
                  data={data}
                  handleClick={() => router.push(`/items/${item.id}`)}
                  handleFavoriteClick={handleItemFavoriteClick}
                  handleDeleteClick={handleDeleteItemClick}
                  handleEditClick={handleEditItemClick}
                  showLocation
                  mutateKey={mutateKey}
                />
              </div>
            ))}

            {filteredContainers?.map((container) => {
              return (
                <div className="table-row" key={container.name}>
                  <ContainerListCard
                    container={container}
                    handleFavoriteClick={handleContainerFavoriteClick}
                    handleUpdateContainer={handleUpdateContainer}
                    handleDeleteClick={handleDeleteClick}
                    handleEditClick={handleEditContainerClick}
                    data={data}
                    handleClick={() =>
                      router.push(`/containers/${container.id}`)
                    }
                    showLocation
                    mutateKey={mutateKey}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      ) : null}
    </>
  );
};

export default AllContents;
