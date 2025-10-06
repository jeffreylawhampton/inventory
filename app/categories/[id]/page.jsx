"use client";
import { useContext, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  AddItems,
  ContextMenu,
  DeleteButtons,
  EditCategory,
  EmptyCard,
  Favorite,
  Header,
  ItemCardMasonry,
  ListViewCard,
  Loading,
  PickerMenu,
  SortAndFilter,
  SquareItemCard,
  ThumbnailCard,
  ThumbnailGrid,
  UpdateColor,
  UpdateIcon,
} from "@/app/components";
import { ScrollArea } from "@mantine/core";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "@/app/providers";
import {
  checkSelected,
  fetcher,
  toggleListFavorite,
  handleToggleDelete,
} from "@/app/lib/helpers";
import CreateItem from "./CreateItem";
import { handleFavoriteClick, notify } from "@/app/lib/handlers";
import { handleDeleteSingle, handleRemove } from "../handlers";
import { deleteObject, toggleFavorite } from "@/app/lib/db";
import EditListItem from "@/app/items/EditListItem";
import { orderBy } from "lodash";

const Page = ({ params: { id } }) => {
  const mutateKey = `/categories/api/${id}`;
  const { data, isLoading, error } = useSWR(mutateKey, fetcher);
  const { user } = useUser();

  const router = useRouter();
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);
  const {
    categoryFilters,
    containerFilters,
    filter,
    iconFilters,
    locationFilters,
    showFavorites,
    view,
    sortType,
    sortDirection,
    setFilter,
  } = useContext(FilterContext);
  const { isSafari, isMobile } = useContext(DeviceContext);
  const {
    setCurrentModal,
    close,
    open,
    showDelete,
    showRemove,
    setShowRemove,
    handleCancel,
  } = useContext(ModalContext);

  useEffect(() => {
    return () => {
      setFilter("");
    };
  }, [setFilter]);

  if (isLoading) return <Loading />;
  if (error) return <div>failed to load</div>;

  const onEditCategory = () => {
    setCurrentModal({
      component: (
        <EditCategory data={data} close={close} mutateKey={mutateKey} />
      ),
      size: "lg",
    }),
      open();
  };

  const onCreateItem = () => {
    setCurrentModal({
      component: <CreateItem data={data} close={close} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    }),
      open();
  };

  const handleEditClick = (item) => {
    setCurrentModal({
      component: (
        <EditListItem
          data={data}
          item={item}
          close={close}
          mutateKey={mutateKey}
          hidden={[]}
        />
      ),
      size: isMobile ? "xl" : "75%",
    }),
      open();
  };

  const onAddItems = () => {
    setCurrentModal({
      component: (
        <AddItems
          pageData={data}
          type="category"
          close={close}
          mutateKey={mutateKey}
        />
      ),
      size: isMobile ? "xl" : "90%",
      title: `Add items to ${data?.name}`,
    });
    open();
  };

  const onUpdateColor = () => {
    setCurrentModal({
      component: (
        <UpdateColor
          data={data}
          close={close}
          mutateKey={mutateKey}
          type="category"
          additionalMutate="/categories/api"
        />
      ),
      size: "lg",
    }),
      open();
  };

  const onUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={data}
          close={close}
          mutateKey={mutateKey}
          type="category"
          additionalMutate="/categories/api"
        />
      ),
      size: "xl",
    }),
      open();
  };

  const handleItemFavoriteClick = async (item) => {
    const add = !item?.favorite;
    try {
      await mutate(
        mutateKey,
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: {
            ...data,
            items: toggleListFavorite(data.items, item),
          },
          rollbackOnError: true,
          revalidate: true,
          populateCache: false,
        }
      );
      notify({
        message: `${item.name} ${add ? `added to` : `removed from`} favorites`,
      });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  const handleDeleteClick = async (item) => {
    try {
      if (confirm(`Delete ${item?.name}?`)) {
        await mutate(
          mutateKey,
          deleteObject({ id: item.id, type: "item", navigate: false }),
          {
            optimisticData: {
              ...data,
              items: data?.items?.filter((i) => i.id != item.id),
            },
            revalidate: true,
            populateCache: false,
            rollbackOnError: true,
          }
        );
        notify({ message: `Deleted ${item?.name}` });
      }
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  const handleItemClick = (item) => {
    if (showDelete || showRemove) {
      handleToggleDelete(item, "name", selectedObjects, setSelectedObjects);
    } else {
      router.push(`/items/${item.id}`);
    }
  };

  const locationArray = locationFilters?.map((location) => location.id);
  const containerArray = containerFilters?.map((container) => container.id);

  let filteredResults = data?.items?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(filter?.toLowerCase()) ||
      item?.description?.toLowerCase().includes(filter?.toLowerCase()) ||
      item?.purchasedAt?.toLowerCase().includes(filter?.toLowerCase())
  );

  if (locationFilters?.length) {
    filteredResults = filteredResults.filter((item) =>
      locationArray.includes(item.location?.id)
    );
  }

  if (containerFilters?.length) {
    filteredResults = filteredResults.filter((item) =>
      containerArray.includes(item.container?.id)
    );
  }

  if (iconFilters?.length) {
    filteredResults = filteredResults?.filter((i) =>
      iconFilters?.includes(i.icon)
    );
  }

  if (categoryFilters?.length) {
    filteredResults = filteredResults.filter(({ categories }) =>
      categories?.some(({ id }) =>
        categoryFilters?.find((category) => category.id === id)
      )
    );
  }

  if (showFavorites)
    filteredResults = filteredResults.filter((item) => item.favorite);

  filteredResults = orderBy(
    filteredResults,
    sortType,
    sortDirection ? "desc" : "asc"
  );

  return (
    <div className="pb-32">
      <Header />
      <div className="flex gap-1 items-center pt-10 pb-4 px-1.5 lg:px-3">
        <h1 className="font-bold text-3xl lg:text-4xl mr-2">{data?.name}</h1>

        <PickerMenu
          data={data}
          type="category"
          updateColorClick={onUpdateColor}
          handleIconPickerClick={onUpdateIcon}
          iconSize={24}
          isCard={false}
        />
        <Favorite
          item={data}
          onClick={() =>
            handleFavoriteClick({
              data,
              key: mutateKey,
              type: "category",
            })
          }
          size={isMobile ? 22 : 26}
          classes="ml-1.5"
        />
      </div>
      {data?.items?.length ? (
        <>
          <SortAndFilter
            data={data?.items}
            type="category"
            showItemSort={data?.items?.length}
          />
          <div className="px-1.5 lg:px-3">
            {!view ? (
              <ThumbnailGrid>
                {filteredResults?.map((item) => {
                  return (
                    <ThumbnailCard
                      item={item}
                      type="item"
                      key={item.id + item.name}
                      path={`/items/${item.id}`}
                      showLocation
                      handleClick={handleItemClick}
                      isSelected={checkSelected(item, selectedObjects)}
                    />
                  );
                })}
              </ThumbnailGrid>
            ) : null}

            {view === 1 ? (
              <ItemCardMasonry>
                {filteredResults?.map((item) => {
                  return (
                    <SquareItemCard
                      key={item.name}
                      item={item}
                      showLocation={true}
                      handleClick={handleItemClick}
                      handleFavoriteClick={handleItemFavoriteClick}
                      isSelected={checkSelected(item, selectedObjects)}
                      hideCategory={data.id}
                    />
                  );
                })}
              </ItemCardMasonry>
            ) : null}
          </div>
          {view === 2 ? (
            <ScrollArea.Autosize
              w="100%"
              h="auto"
              scrollbars="x"
              type="scroll"
              offsetScrollbars="x"
              className="lg:pl-1"
            >
              {filteredResults?.map((item) => {
                return (
                  <ListViewCard
                    key={item?.name}
                    mutateKey={mutateKey}
                    item={item}
                    data={data}
                    showRemove={showRemove}
                    showLocation
                    handleFavoriteClick={handleItemFavoriteClick}
                    handleDeleteClick={handleDeleteClick}
                    handleEditClick={handleEditClick}
                    handleClick={handleItemClick}
                    selectedObjects={selectedObjects}
                    hideCategory={data.id}
                    isSelected={checkSelected(item, selectedObjects)}
                  />
                );
              })}
            </ScrollArea.Autosize>
          ) : null}
        </>
      ) : (
        <EmptyCard
          move={onAddItems}
          add={onCreateItem}
          moveLabel={`Add existing items to ${data?.name}`}
          isCategory
        />
      )}
      <ContextMenu
        onAdd={onAddItems}
        onRemove={data?.items?.length ? () => setShowRemove(true) : null}
        type="category"
        onDelete={() => handleDeleteSingle({ data, isSafari, user })}
        onEdit={onEditCategory}
        onCreateItem={onCreateItem}
        addLabel={`Add items to ${data?.name}`}
        name={data?.name}
      />
      {showRemove ? (
        <DeleteButtons
          handleCancelItems={handleCancel}
          handleRemove={() =>
            handleRemove({
              data,
              mutateKey,
              setShowRemove,
              selectedObjects,
              setSelectedObjects,
            })
          }
          type="items"
          count={selectedObjects?.length}
          isRemove
        />
      ) : null}
    </div>
  );
};

export default Page;
