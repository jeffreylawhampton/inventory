"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import {
  AddModal,
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
  SearchFilter,
  UpdateColor,
  ViewToggle,
} from "@/app/components";
import Nested from "./Nested";
import CreateItem from "./CreateItem";
import { sortObjectArray, getFilterCounts } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/layout";
import AllContents from "./AllContents";
import { Button } from "@mantine/core";
import { fetcher } from "@/app/lib/fetcher";
import { SingleCategoryIcon } from "@/app/assets";
import { v4 } from "uuid";
import {
  handleFavoriteClick,
  handleItemFavorite,
  handleContainerFavorite,
  handleDelete,
} from "../handlers";

const Page = ({ params: { id } }) => {
  const mutateKey = `/containers/api/${id}`;
  const { data, error, isLoading } = useSWR(mutateKey, fetcher);
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [isRemove, setIsRemove] = useState(false);
  const [view, setView] = useState(0);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const { isSafari, setCurrentModal, open, close, isMobile } =
    useContext(DeviceContext);

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

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

        <UpdateColor
          data={data}
          type="container"
          mutateKey={mutateKey}
          size={isMobile ? 20 : 26}
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
          size={isMobile ? 22 : 26}
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
          handleAdd={handleAdd}
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
          handleAdd={handleAdd}
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
        onAdd={handleAdd}
        onCreateItem={onCreateItem}
        onCreateContainer={onCreateContainer}
        name={data?.name}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        type="container"
        name={data?.name}
        itemList={data?.items}
        isRemove={isRemove}
      />
    </>
  );
};

export default Page;
