"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  AddItems,
  BreadcrumbTrail,
  ContainerForm,
  ContextMenu,
  EditContainer,
  Favorite,
  Header,
  Loading,
  NewContainer,
  PickerMenu,
  SortAndFilter,
  UpdateColor,
  UpdateIcon,
  ViewToggle,
} from "@/app/components";
import DeleteButtons from "../DeleteButtons";
import Nested from "./Nested";
import CreateItem from "./CreateItem";
import { fetcher, handleToggleDelete } from "@/app/lib/helpers";
import { handleFavoriteClick, mutateProps, notify } from "@/app/lib/handlers";
import {
  AccordionContext,
  DeviceContext,
  FilterContext,
  ModalContext,
} from "@/app/providers";
import AllContents from "./AllContents";
import {
  handleContainerFavorite,
  handleDelete,
  handleNestedItemFavoriteClick,
} from "../handlers";
import EditItem from "./EditListItem";
import { groupBy } from "lodash";
import { deleteMany, deleteObject, updateContainerName } from "@/app/lib/db";

const Page = ({ params: { id } }) => {
  const mutateKey = `/containers/api/${id}`;
  const { data, error, isLoading } = useSWR(mutateKey, fetcher);
  const [formError, setFormError] = useState(false);
  const [results, setResults] = useState([]);
  const { isSafari, isMobile } = useContext(DeviceContext);

  const {
    setCurrentModal,
    open,
    close,
    showDelete,
    setShowDelete,
    handleCancel,
  } = useContext(ModalContext);
  const { containerToggle, setContainerToggle, filter, setFilter } =
    useContext(FilterContext);
  const { selectedObjects, setSelectedObjects } = useContext(AccordionContext);

  const router = useRouter();

  const onCreateContainer = () => {
    setCurrentModal({
      component: (
        <NewContainer
          data={{ ...data, type: "container" }}
          mutateKey={mutateKey}
          close={close}
          hidden={["containerId", "locationId"]}
        />
      ),
      title: "Create a new container",
      size: "lg",
    });
    open();
  };

  const onEditContainer = () => {
    setCurrentModal({
      component: (
        <EditContainer data={data} close={close} mutateKey={mutateKey} />
      ),
      size: "lg",
    });
    open();
  };

  const onCreateItem = () => {
    setCurrentModal({
      component: (
        <CreateItem
          data={data}
          close={close}
          mutateKey={`/containers/api/${id}`}
        />
      ),
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const onAddItems = () => {
    setCurrentModal({
      component: (
        <AddItems
          pageData={data}
          type="container"
          close={close}
          mutateKey={mutateKey}
        />
      ),
      size: isMobile ? "xl" : "90%",
      title: `Move items to ${data?.name}`,
    });
    open();
  };
  const handleClick = (item) => {
    showDelete
      ? handleToggleDelete(item, "name", selectedObjects, setSelectedObjects)
      : router.push(
          `/${item?.hasOwnProperty("containerId") ? "items" : "containers"}/${
            item.id
          }`
        );
  };

  const handleEditItemClick = (item) => {
    setCurrentModal({
      component: (
        <EditItem data={data} item={item} close={close} mutateKey={mutateKey} />
      ),
      size: isMobile ? "xl" : "75%",
    }),
      open();
  };

  const handleEditContainerClick = (container) => {
    setCurrentModal({
      component: (
        <ContainerForm
          container={container}
          close={close}
          mutateKey={mutateKey}
          formError={formError}
          setFormError={setFormError}
          handleSubmit={handleContainerSubmit}
        />
      ),
      size: "lg",
      title: "Update container",
    });
    open();
  };

  const handleUpdateColor = () => {
    setCurrentModal({
      component: (
        <UpdateColor
          data={data}
          type="container"
          close={close}
          mutateKey={mutateKey}
          additionalMutate="/containers/api"
        />
      ),
      size: isMobile ? "lg" : "md",
      title: null,
    });
    open();
  };

  const handleUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={data}
          type="container"
          close={close}
          mutateKey={mutateKey}
        />
      ),
      size: "xl",
      title: null,
    });
    open();
  };

  const handleDeleteMany = async () => {
    const split = groupBy(selectedObjects, "type");
    setShowDelete(false);
    const selectedContainerIds = new Set(
      split.container?.map((c) => c.id) || []
    );
    const selectedItemIds = new Set(split.item?.map((i) => i.id) || []);
    let optimisticData;
    if (Array.isArray(data)) {
      const optimisticData = data
        ?.filter((container) => !selectedContainerIds.has(container.id))
        ?.map((container) => ({
          ...container,
          items:
            container.items?.filter((item) => !selectedItemIds.has(item.id)) ||
            [],
        }));
    }
    try {
      await Promise.all(
        Object.entries(split).map(([type, list]) =>
          mutate(
            mutateKey,
            deleteMany({
              type,
              selected: list.map((i) => i.id),
            }),
            {
              optimisticData,
              rollbackOnError: true,
              revalidate: true,
              populateCache: false,
            }
          )
        )
      );
      location.reload(true);
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleDeleteItemClick = async (item) => {
    if (confirm(`Delete ${item?.name}?`)) {
      try {
        const optimisticData = {
          ...data,
          ...(item?.containerId === data.id
            ? {
                items: data?.items?.filter((i) => i.id != item.id),
              }
            : {
                containers: data?.containers?.map((c) =>
                  c.id === item.containerId
                    ? {
                        ...c,
                        items: c.items?.filter((i) => i.id != item.id),
                      }
                    : c
                ),
              }),
        };

        await mutate(mutateKey, deleteObject({ id: item.id, type: "item" }), {
          optimisticData,
          rollbackOnError: true,
          revalidate: true,
          populateCache: false,
        });
        notify({ message: `Deleted ${item.name}` });
      } catch (e) {
        notify({ isError: true });
        throw new Error(e);
      }
    }
  };

  const handleContainerFavoriteClick = (container) => {
    return handleContainerFavorite({
      container,
      data,
      mutateKey,
      setResults,
    });
  };

  const handleItemFavoriteClick = (item) => {
    return handleNestedItemFavoriteClick({
      item,
      data,
      mutateKey,
    });
  };

  const updateColorClick = () => {
    handleUpdateColor();
  };

  const updateIconClick = () => {
    handleUpdateIcon();
  };

  const handleContainerSubmit = async (container) => {
    close();
    try {
      await mutate(
        mutateKey,
        updateContainerName({ id: container.id, name: container.name }),
        {
          optimisticData: {
            ...data,
            containers: data?.containers?.map((c) =>
              c.id === container.id ? container : { ...c }
            ),
          },
          ...mutateProps,
        }
      );
      notify({ message: `Updated ${container.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  const itemList = data?.items?.map((i) => i) ?? [];
  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  useEffect(() => {
    return () => {
      setFilter("");
    };
  }, [setFilter]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="pb-32">
      <Header />
      <div className="flex gap-1 items-center pt-10 pb-4">
        <h1 className="font-bold text-2xl lg:text-4xl mr-2">{data?.name}</h1>

        <PickerMenu
          data={data}
          type="container"
          handleIconPickerClick={updateIconClick}
          updateColorClick={updateColorClick}
          iconSize={isMobile ? 22 : 25}
          isCard={false}
        />
        <Favorite
          item={data}
          onClick={() =>
            handleFavoriteClick({
              data,
              key: mutateKey,
              type: "container",
            })
          }
          size={isMobile ? 21 : 25}
          classes="ml-1"
        />
      </div>
      <BreadcrumbTrail data={{ ...data, type: "container" }} />
      <div className="h-4" />

      <ViewToggle
        active={containerToggle}
        setActive={setContainerToggle}
        data={["Nested", "All"]}
      />

      <SortAndFilter
        data={data?.containers?.concat(itemList)}
        showLocationFilters={false}
        hideSortFilter={!containerToggle}
      />

      {!containerToggle ? (
        <Nested
          data={data}
          handleAdd={onAddItems}
          onCreateContainer={onCreateContainer}
          onCreateItem={onCreateItem}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleEditItemClick={handleEditItemClick}
          handleDeleteItemClick={handleDeleteItemClick}
          handleEditContainerClick={handleEditContainerClick}
          handleClick={handleClick}
          results={results}
          setResults={setResults}
          id={id}
          mutateKey={mutateKey}
        />
      ) : (
        <AllContents
          filter={filter}
          handleAdd={onAddItems}
          id={id}
          data={data}
          itemList={itemList}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleDeleteItemClick={handleDeleteItemClick}
          handleEditContainerClick={handleEditContainerClick}
          handleClick={handleClick}
          mutateKey={mutateKey}
          handleEditItemClick={handleEditItemClick}
        />
      )}

      <ContextMenu
        type="container"
        onDelete={() =>
          handleDelete({ isSafari, data, mutateKey: "/containers/api" })
        }
        onEdit={onEditContainer}
        onAdd={onAddItems}
        onCreateItem={onCreateItem}
        onCreateContainer={onCreateContainer}
        onDeleteItems={() => setShowDelete(true)}
        name={data?.name}
        addLabel={`Move items to ${data?.name}`}
      />

      {showDelete ? (
        <DeleteButtons
          handleCancel={handleCancel}
          handleDelete={handleDeleteMany}
          count={selectedObjects?.length}
        />
      ) : null}
    </div>
  );
};

export default Page;
