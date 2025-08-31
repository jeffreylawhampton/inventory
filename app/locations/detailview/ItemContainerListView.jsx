import { useContext } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import {
  CardToggle,
  ContainerListCard,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  GridLayout,
  ListViewCard,
  SearchFilter,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import ColorCard from "./ColorCard";
import ItemCard from "./ItemCard";
import { v4 } from "uuid";
import { SingleCategoryIcon } from "@/app/assets";
import { getFilterCounts, sortObjectArray } from "@/app/lib/helpers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "@/app/providers";
import { LocationContext } from "../layout";
import {
  handleCardFavoriteClick,
  handleContainerClick,
  handleItemClick,
  handleDeleteClick,
} from "../handlers";
import { ScrollArea } from "@mantine/core";
import { updateContainerName } from "@/app/lib/db";

const ItemContainerListView = ({ data, fetchKey }) => {
  const router = useRouter();
  const { close } = useContext(ModalContext);
  const { width } = useContext(DeviceContext);
  const { handleUpdateItem, counts } = useContext(LocationContext);

  const withCounts = (container) => {
    const { itemCount, containerCount } = counts?.find(
      (c) => c.id === container.id
    );
    return { ...container, containerCount, itemCount };
  };

  const {
    openLocations,
    setOpenLocations,
    openLocationContainers,
    setOpenLocationContainers,
  } = useContext(AccordionContext);

  const {
    categoryFilters,
    setCategoryFilters,
    filter,
    setFilter,
    showFavorites,
    setShowFavorites,
    view,
  } = useContext(FilterContext);

  let itemsToShow = {
    items: [...data?.items],
    containers: [...data?.containers],
  };

  if (showFavorites) {
    itemsToShow.items = itemsToShow?.items?.filter((i) => i.favorite);
    itemsToShow.containers = itemsToShow?.containers?.filter((c) => c.favorite);
  }

  if (filter) {
    itemsToShow.items = itemsToShow?.items?.filter((i) =>
      i.name?.toLowerCase().includes(filter.toLowerCase())
    );
    itemsToShow.containers = itemsToShow?.containers?.filter((c) =>
      c.name?.toLowerCase()?.includes(filter.toLowerCase())
    );
  }

  if (categoryFilters?.length) {
    itemsToShow.items = itemsToShow?.items?.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
    itemsToShow.containers = [];
  }

  const categoryFilterOptions = getFilterCounts(data?.items, "categories");

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const handleUpdateContainer = async (editedContainer) => {
    try {
      await mutate(
        fetchKey,
        updateContainerName({
          id: editedContainer.id,
          name: editedContainer.name,
        }),
        {
          optimisticData: {
            ...data,
            containers: data?.containers?.map((c) =>
              c.id === editedContainer.id
                ? { ...c, name: editedContainer.name }
                : c
            ),
          },
          rollbackOnError: true,
          revalidate: false,
          populateCache: false,
        }
      );
      mutate("/locations/api");
      close();
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <div className="pb-32">
      <div className="px-1.5 lg:px-3">
        <SearchFilter
          onChange={(e) => setFilter(e.target.value)}
          label="Filter by name"
          size="md"
          padding=""
          classNames="max-md:w-full grow"
        />
        <div className="flex flex-wrap-reverse gap-2 items-center mt-4 mb-2">
          <CardToggle />
          {categoryFilterOptions?.length ? (
            <FilterButton
              filters={categoryFilters}
              setFilters={setCategoryFilters}
              options={categoryFilterOptions}
              label="Categories"
            />
          ) : null}
          <FavoriteFilterButton />
        </div>

        <div className="flex gap-1 mb-3 flex-wrap">
          {categoryFilters?.map((category) => {
            return (
              <FilterPill
                key={v4()}
                onClose={onCategoryClose}
                item={category}
                icon={
                  <SingleCategoryIcon width={12} fill={category.color?.hex} />
                }
              />
            );
          })}
          {showFavorites ? <FilterPill onClose={setShowFavorites} /> : null}
        </div>

        {!view ? (
          <ThumbnailGrid classes="pb-32 lg:pb-12">
            {sortObjectArray(itemsToShow?.items)?.map((item) => (
              <ThumbnailCard
                key={v4()}
                item={item}
                type="item"
                path={`?type=item&id=${item.id}`}
                handleClick={() =>
                  handleItemClick({
                    item,
                    openLocations,
                    setOpenLocations,
                    openLocationContainers,
                    setOpenLocationContainers,
                    router,
                  })
                }
              />
            ))}

            {sortObjectArray(itemsToShow?.containers)?.map((container) => (
              <ThumbnailCard
                key={v4()}
                item={withCounts(container)}
                type="container"
                path={`?type=container&id=${container.id}`}
                handleClick={() =>
                  handleContainerClick({
                    container,
                    openLocations,
                    setOpenLocations,
                    openLocationContainers,
                    setOpenLocationContainers,
                    router,
                  })
                }
              />
            ))}
          </ThumbnailGrid>
        ) : null}

        {view === 1 ? (
          <GridLayout classes="lg:pb-4">
            {itemsToShow?.items?.map((item) => (
              <ItemCard
                item={item}
                key={`mainpage${item.name}`}
                data={data}
                fetchKey={fetchKey}
                handleClick={() =>
                  handleItemClick({
                    item,
                    openLocations,
                    setOpenLocations,
                    openLocationContainers,
                    setOpenLocationContainers,
                    router,
                  })
                }
              />
            ))}
            {itemsToShow?.containers?.map((container) => {
              return (
                <ColorCard
                  container={withCounts(container)}
                  key={`mainpage${container.name}`}
                  data={data}
                  fetchKey={fetchKey}
                  handleClick={() =>
                    handleContainerClick({
                      container,
                      openLocations,
                      setOpenLocations,
                      openLocationContainers,
                      setOpenLocationContainers,
                      router,
                    })
                  }
                />
              );
            })}
          </GridLayout>
        ) : null}
      </div>
      {view === 2 ? (
        <ScrollArea
          w="100%"
          scrollbars="x"
          type="hover"
          offsetScrollbars="x"
          classNames={{
            root: "list !text-[15px] font-medium lg:pl-1",
          }}
        >
          <div className="table w-max min-w-full">
            {itemsToShow?.items?.map((item) => {
              return (
                <div className="table-row" key={item.name}>
                  <ListViewCard
                    item={item}
                    data={data}
                    handleFavoriteClick={() =>
                      handleCardFavoriteClick({
                        item,
                        key: fetchKey,
                        data,
                        type: "item",
                      })
                    }
                    handleClick={() =>
                      handleItemClick({
                        item,
                        openLocations,
                        setOpenLocations,
                        openLocationContainers,
                        setOpenLocationContainers,
                        router,
                      })
                    }
                    handleEditClick={handleUpdateItem}
                    handleDeleteClick={() =>
                      handleDeleteClick({
                        item,
                        type: "item",
                        data,
                        mutateKey: fetchKey,
                      })
                    }
                    showLocation={false}
                    isSelected={false}
                    mutateKey={fetchKey}
                  />
                </div>
              );
            })}
            {itemsToShow?.containers?.map((container) => {
              return (
                <div className="table-row" key={`mainpage${container.name}`}>
                  <ContainerListCard
                    mutateKey={fetchKey}
                    container={withCounts(container)}
                    data={data}
                    handleDeleteClick={() =>
                      handleDeleteClick({
                        item: container,
                        type: "container",
                        data,
                        mutateKey: fetchKey,
                      })
                    }
                    handleFavoriteClick={() =>
                      handleCardFavoriteClick({
                        item: container,
                        key: fetchKey,
                        data,
                        type: "container",
                      })
                    }
                    handleClick={() =>
                      handleContainerClick({
                        container,
                        openLocations,
                        setOpenLocations,
                        openLocationContainers,
                        setOpenLocationContainers,
                        router,
                      })
                    }
                    handleUpdateContainer={handleUpdateContainer}
                    width={width}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
};

export default ItemContainerListView;
