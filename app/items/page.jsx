"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  ContextMenu,
  DeleteButtons,
  Header,
  ItemCardMasonry,
  ListViewCard,
  Loading,
  SortAndFilter,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import NewItem from "./NewItem";
import { checkSelected, fetcher, handleToggleDelete } from "../lib/helpers";
import { v4 } from "uuid";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "../providers";
import { handleDeleteMany, handleFavoriteClick } from "./handlers";
import { notify } from "../lib/handlers";
import { deleteObject } from "../lib/db";
import EditListItem from "./EditListItem";
import { orderBy } from "lodash";

const Page = ({ searchParams }) => {
  const query = searchParams?.query || "";
  const mutateKey = `/items/api?search=${query}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const { isMobile } = useContext(DeviceContext);
  const {
    categoryFilters,
    filter,
    setFilter,
    locationFilters,
    iconFilters,
    showFavorites,
    view,
    sortType,
    sortDirection,
  } = useContext(FilterContext);
  const {
    setCurrentModal,
    open,
    close,
    showDelete,
    setShowDelete,
    handleCancel,
  } = useContext(ModalContext);
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);

  const router = useRouter();

  useEffect(() => {
    return () => {
      setFilter("");
    };
  }, [setFilter]);

  if (isLoading) return <Loading />;
  if (error) return "Failed to fetch";

  const onCreateItem = () => {
    setCurrentModal({
      component: <NewItem data={data} close={close} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const onEditItem = (item) => {
    setCurrentModal({
      component: (
        <EditListItem
          data={data}
          item={item}
          mutateKey={mutateKey}
          close={close}
        />
      ),
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const locationArray = locationFilters?.map((location) => location);
  let itemsToShow = Array.isArray(data)
    ? data?.filter(
        (item) =>
          item.name?.toLowerCase()?.includes(filter?.toLowerCase()) ||
          item.description?.toLowerCase()?.includes(filter?.toLowerCase()) ||
          item.purchasedAt?.toLowerCase()?.includes(filter?.toLowerCase())
      )
    : [];

  if (categoryFilters?.length) {
    itemsToShow = itemsToShow.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
  }

  if (iconFilters?.length) {
    itemsToShow = itemsToShow?.filter((item) =>
      iconFilters?.find((i) => item.icon === i)
    );
  }

  if (locationFilters?.length) {
    itemsToShow = itemsToShow.filter((item) =>
      locationArray.find((l) => l.id === item.location?.id)
    );

    if (locationFilters?.find((i) => !i.id)) {
      itemsToShow = itemsToShow.concat(data?.filter((i) => !i.locationId));
    }
  }

  if (showFavorites) {
    itemsToShow = itemsToShow?.filter((item) => item.favorite);
  }

  itemsToShow = orderBy(itemsToShow, sortType, sortDirection ? "desc" : "asc");

  const handleFavorite = (item) => {
    return handleFavoriteClick({
      item,
      data,
      mutateKey,
    });
  };

  const handleClick = (item) => {
    showDelete
      ? handleToggleDelete(item, "name", selectedObjects, setSelectedObjects)
      : router.push(`/items/${item.id}`);
  };

  const handleListDeleteClick = async (item) => {
    if (confirm(`Delete ${item.name}?`)) {
      try {
        await mutate(
          mutateKey,
          deleteObject({ id: item.id, type: "item", navigate: false }),
          {
            optimisticData: itemsToShow?.filter((i) => i.id != item.id),
            revalidate: true,
            populateCache: false,
            rollbackOnError: true,
          }
        );
      } catch (e) {
        notify({ isError: true });
        throw new Error(e);
      }
    }
  };

  return (
    <div className="pb-64 lg:pb-32">
      <Header />
      <div className="px-1.5 lg:px-3">
        <h1 className="font-bold text-4xl pt-8 pb-4 ">Items</h1>
        <SortAndFilter data={data} type="item" />

        {!view ? (
          <ThumbnailGrid>
            {itemsToShow?.map((item) => {
              return (
                <ThumbnailCard
                  key={v4()}
                  item={item}
                  type="item"
                  path={`/items/${item.id}`}
                  showLocation
                  handleClick={handleClick}
                  isSelected={checkSelected(item, selectedObjects)}
                />
              );
            })}
          </ThumbnailGrid>
        ) : null}

        {view === 1 ? (
          <ItemCardMasonry>
            {itemsToShow?.map((item) => {
              return (
                <SquareItemCard
                  key={item.name}
                  item={item}
                  showLocation
                  handleClick={handleClick}
                  handleFavoriteClick={handleFavorite}
                  isSelected={checkSelected(item, selectedObjects)}
                />
              );
            })}
          </ItemCardMasonry>
        ) : null}
      </div>
      {view === 2 ? (
        <div className="lg:px-1">
          {itemsToShow?.map((item) => {
            return (
              <ListViewCard
                key={item.name}
                item={item}
                data={data}
                handleFavoriteClick={handleFavorite}
                handleDeleteClick={handleListDeleteClick}
                handleEditClick={onEditItem}
                handleClick={handleClick}
                showLocation
                mutateKey={mutateKey}
                isSelected={checkSelected(item, selectedObjects)}
              />
            );
          })}
        </div>
      ) : null}

      <ContextMenu
        onDelete={() => setShowDelete(true)}
        onCreateItem={onCreateItem}
        type="items"
        showRemove={false}
      />

      {showDelete ? (
        <DeleteButtons
          handleCancelItems={handleCancel}
          handleDeleteItems={() =>
            handleDeleteMany({
              selectedObjects,
              setSelectedObjects,
              setShowDelete,
              data,
              mutateKey,
            })
          }
          count={selectedObjects?.length}
          type="items"
        />
      ) : null}
    </div>
  );
};

export default Page;
