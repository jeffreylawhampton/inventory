"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  AddItems,
  BreadcrumbTrail,
  CardToggle,
  ContainerForm,
  ContextMenu,
  EditContainer,
  Favorite,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  Header,
  Loading,
  NewContainer,
  PickerMenu,
  SearchFilter,
  UpdateColor,
  UpdateIcon,
  ViewToggle,
} from "@/app/components";
import DeleteButtons from "../DeleteButtons";
import Nested from "./Nested";
import CreateItem from "./CreateItem";
import {
  fetcher,
  getFilterCounts,
  handleToggleDelete,
} from "@/app/lib/helpers";
import { handleFavoriteClick, mutateProps, notify } from "@/app/lib/handlers";
import { DeviceContext } from "@/app/providers";
import AllContents from "./AllContents";
import { Button } from "@mantine/core";
import { SingleCategoryIcon } from "@/app/assets";
import { v4 } from "uuid";
import {
  handleContainerFavorite,
  handleDelete,
  handleNestedItemFavoriteClick,
} from "../handlers";
import EditItem from "./EditListItem";
import { groupBy } from "lodash";
import { deleteMany, updateContainerName } from "@/app/lib/db";

const Page = ({ params: { id } }) => {
  const mutateKey = `/containers/api/${id}`;
  const { data, error, isLoading } = useSWR(mutateKey, fetcher);
  const [filter, setFilter] = useState("");
  const [opened, setOpened] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [formError, setFormError] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [results, setResults] = useState([]);
  const {
    isSafari,
    setCurrentModal,
    open,
    close,
    isMobile,
    containerToggle,
    setContainerToggle,
  } = useContext(DeviceContext);

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

  const handleCancel = () => {
    setSelectedObjects([]);
    setShowDelete(false);
  };

  const handleDeleteMany = async () => {
    const split = groupBy(selectedObjects, "type");
    setShowDelete(false);
    const selectedContainerIds = new Set(
      split.container?.map((c) => c.id) || []
    );
    const selectedItemIds = new Set(split.item?.map((i) => i.id) || []);
    const optimisticData = data
      ?.filter((container) => !selectedContainerIds.has(container.id))
      ?.map((container) => ({
        ...container,
        items:
          container.items?.filter((item) => !selectedItemIds.has(item.id)) ||
          [],
      }));
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
    } catch (e) {
      throw new Error(e);
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
    setOpened(() => false);
    handleUpdateColor();
  };

  const updateIconClick = () => {
    setOpened(() => false);
    handleUpdateIcon();
  };

  const onCategoryClose = (id) => {
    setCategoryFilters(categoryFilters.filter((category) => category.id != id));
  };

  const handleClear = () => {
    setCategoryFilters([]);
    setShowFavorites(false);
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

  const categoryFilterOptions = getFilterCounts(itemList, "categories");

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="pb-32">
      <Header />
      <div className="flex gap-1 items-center pt-10 pb-4">
        <h1 className="font-bold text-2xl lg:text-4xl mr-2">{data?.name}</h1>

        <PickerMenu
          opened={opened}
          setOpened={setOpened}
          data={data}
          type="container"
          handleIconPickerClick={updateIconClick}
          updateColorClick={updateColorClick}
          iconSize={25}
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
          size={25}
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

      <div className="flex flex-wrap-reverse gap-2 items-center mb-4">
        <CardToggle containerToggle={containerToggle} />
        {containerToggle === 1 ? (
          <>
            {categoryFilterOptions?.length ? (
              <FilterButton
                filters={categoryFilters}
                setFilters={setCategoryFilters}
                options={categoryFilterOptions}
                label="Categories"
              />
            ) : null}
            <FavoriteFilterButton
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
            />
            <SearchFilter
              filter={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by name"
              size="md"
              padding=""
              classNames="max-md:w-full grow"
            />
          </>
        ) : null}
      </div>

      <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3 ">
        {categoryFilters?.map((category) => {
          return (
            <FilterPill
              key={v4()}
              item={category}
              icon={
                <SingleCategoryIcon width={12} fill={category.color?.hex} />
              }
              onClose={onCategoryClose}
            />
          );
        })}

        {showFavorites ? <FilterPill onClose={setShowFavorites} /> : null}

        {categoryFilters?.length > 1 ? (
          <Button variant="subtle" onClick={handleClear} size="xs">
            Clear all
          </Button>
        ) : null}
      </div>

      {!containerToggle ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={onAddItems}
          onCreateContainer={onCreateContainer}
          onCreateItem={onCreateItem}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleEditItemClick={handleEditItemClick}
          handleEditContainerClick={handleEditContainerClick}
          handleClick={handleClick}
          results={results}
          setResults={setResults}
          id={id}
          mutateKey={mutateKey}
          selectedObjects={selectedObjects}
          setSelectedObjects={setSelectedObjects}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
        />
      ) : (
        <AllContents
          filter={filter}
          handleAdd={onAddItems}
          id={id}
          showFavorites={showFavorites}
          data={data}
          itemList={itemList}
          categoryFilters={categoryFilters}
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleEditContainerClick={handleEditContainerClick}
          handleClick={handleClick}
          mutateKey={mutateKey}
          handleEditItemClick={handleEditItemClick}
          selectedObjects={selectedObjects}
          setSelectedObjects={setSelectedObjects}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
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
