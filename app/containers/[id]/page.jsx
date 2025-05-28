"use client";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import {
  AddModal,
  ContextMenu,
  EditContainer,
  Favorite,
  FavoriteFilterButton,
  Header,
  Loading,
  NewContainer,
  SearchFilter,
  UpdateColor,
  ViewToggle,
} from "@/app/components";
import { toggleFavorite, deleteObject } from "@/app/lib/db";
import toast from "react-hot-toast";
import Nested from "./Nested";
import CreateItem from "./CreateItem";
import { sortObjectArray, buildContainerTree } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/layout";
import AllContents from "./AllContents";
import BreadcrumbTrail from "@/app/components/BreadcrumbTrail";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const { data, error, isLoading, mutate } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [view, setView] = useState(0);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const { isSafari, setCrumbs, setCurrentModal, setModalSize, open, close } =
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
    setModalSize("lg");
    setCurrentModal(
      <NewContainer
        data={{ ...data, type: "container" }}
        mutateKey={`container${id}`}
        close={close}
        hidden={["containerId", "locationId"]}
      />
    );
    open();
  };

  const onEditContainer = () => {
    setModalSize("lg");
    setCurrentModal(
      <EditContainer data={data} close={close} mutateKey={`container${id}`} />
    );
    open();
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;

    try {
      await mutate(toggleFavorite({ type: "container", id: data.id, add }), {
        optimisticData: { ...data, favorite: add },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleContainerFavoriteClick = async (container) => {
    const add = !container.favorite;
    let optimisticData = { ...data };
    const containerToUpdate = optimisticData?.containers?.find(
      (con) => con.name === container.name
    );
    containerToUpdate.favorite = add;

    try {
      await mutate(
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: optimisticData,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      setResults(
        sortObjectArray(buildContainerTree(optimisticData?.containers, data.id))
      );
      toast.success(
        add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleItemFavoriteClick = async (item) => {
    const add = !item.favorite;
    const updated = { ...data };

    if (item.containerId === data.id) {
      const itemToUpdate = updated.items.find((i) => i.id === item.id);
      itemToUpdate.favorite = add;
    } else {
      const itemContainer = data.containers?.find(
        (con) => con.id === item.containerId
      );
      const itemToUpdate = itemContainer.items.find((i) => i.id === item.id);
      itemToUpdate.favorite = add;
    }

    try {
      await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
        optimisticData: updated,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      setResults(
        sortObjectArray(buildContainerTree(updated?.containers, data.id))
      );
      return toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleDelete = async () => {
    if (
      !isSafari &&
      !confirm(
        `Are you sure you want to delete ${data?.name || "this container"}?`
      )
    )
      return;
    try {
      await mutate(
        "containers",
        deleteObject({ id, type: "container", navigate: "/containers" })
      );
      toast.success("Deleted");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  useEffect(() => {
    setItems(sortObjectArray(data?.items));
    setCrumbs(<BreadcrumbTrail data={{ ...data, type: "container" }} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  return (
    <>
      <Header />
      <div className="flex gap-2 items-center py-4">
        <h1 className="font-bold text-4xl">{data?.name}</h1>
        <UpdateColor
          data={data}
          type="container"
          mutateKey={`container${id}`}
        />
        <Favorite
          item={data}
          onClick={handleFavoriteClick}
          position=""
          size={26}
        />
      </div>

      <ViewToggle active={view} setActive={setView} data={["Nested", "All"]} />

      {view ? (
        <div className="mb-3">
          <SearchFilter
            label="Filter by name, description, or purchase location"
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
          {data?.items?.length ? (
            <FavoriteFilterButton
              label="Favorites"
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
            />
          ) : null}
        </div>
      ) : null}

      {!view ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={handleAdd}
          onCreateContainer={onCreateContainer}
          setShowCreateItem={setShowCreateItem}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          handleItemFavoriteClick={handleItemFavoriteClick}
          mutate={mutate}
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
          handleItemFavoriteClick={handleItemFavoriteClick}
          handleContainerFavoriteClick={handleContainerFavoriteClick}
          setShowCreateItem={setShowCreateItem}
        />
      )}

      <ContextMenu
        type="container"
        onDelete={handleDelete}
        onEdit={onEditContainer}
        onAdd={handleAdd}
        onCreateItem={() => setShowCreateItem(true)}
        onCreateContainer={onCreateContainer}
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

      {showCreateItem ? (
        <CreateItem
          data={data}
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          mutate={mutate}
        />
      ) : null}
    </>
  );
};

export default Page;
