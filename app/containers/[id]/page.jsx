"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import {
  AddItems,
  BreadcrumbTrail,
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
import Nested from "./Nested";
import CreateItem from "./CreateItem";
import { fetcher, getFilterCounts, sortObjectArray } from "@/app/lib/helpers";
import { handleFavoriteClick } from "@/app/lib/handlers";
import { DeviceContext } from "@/app/providers";
import AllContents from "./AllContents";
import { Button } from "@mantine/core";
import { SingleCategoryIcon } from "@/app/assets";
import { v4 } from "uuid";
import {
  handleItemFavorite,
  handleContainerFavorite,
  handleDelete,
} from "../handlers";

const Page = ({ params: { id } }) => {
  const mutateKey = `/containers/api/${id}`;
  const { data, error, isLoading } = useSWR(mutateKey, fetcher);
  const [filter, setFilter] = useState("");
  const [opened, setOpened] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [view, setView] = useState(0);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const { isSafari, setCurrentModal, open, close, isMobile } =
    useContext(DeviceContext);

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

  const handleContainerFavoriteClick = (container) => {
    return handleContainerFavorite({
      container,
      data,
      mutateKey,
      setResults,
    });
  };

  const handleItemFavoriteClick = (item) => {
    return handleItemFavorite({
      item,
      data,
      mutateKey,
      setResults,
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

  const itemList = data?.items ?? [];
  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );

  const categoryFilterOptions = getFilterCounts(itemList, "categories");

  useEffect(() => {
    setItems(sortObjectArray(data?.items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  return (
    <>
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
      <ViewToggle active={view} setActive={setView} data={["Nested", "All"]} />

      {view ? (
        <div className="flex flex-wrap-reverse gap-2 items-center mb-4">
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
        </div>
      ) : null}

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

      {!view ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={onAddItems}
          onCreateContainer={onCreateContainer}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleItemFavoriteClick={handleItemFavoriteClick}
          items={items}
          setItems={setItems}
          results={results}
          setResults={setResults}
          id={id}
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
        name={data?.name}
        addLabel={`Move items to ${data?.name}`}
      />
    </>
  );
};

export default Page;
