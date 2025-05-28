"use client";
import useSWR, { mutate } from "swr";
import { useState, useContext, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import {
  ColorCard,
  DeleteButtons,
  GridLayout,
  Loading,
  SearchFilter,
  SquareItemCard,
  ViewToggle,
} from "@/app/components";
import toast from "react-hot-toast";
import { deleteMany, addFaves, removeFavorite } from "../lib/db";
import ContextMenu from "./ContextMenu";
import { DeviceContext } from "../layout";
import AddModal from "./AddModal";
import { v4 } from "uuid";
import { sortObjectArray } from "../lib/helpers";
import Header from "../components/Header";

const HomePage = () => {
  const tabs = ["items", "containers", "categories"];
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [unfavesLoading, setUnfavesLoading] = useState(true);
  const [unfaves, setUnfaves] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { setCrumbs } = useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(
    `/homepage/api?type=${tabs[activeTab]}&favorite=true`,
    fetcher
  );

  useEffect(() => {
    setCrumbs(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUnfaves = async () => {
    const res = await fetch(
      `/homepage/api?type=${tabs[activeTab]}&favorite=false`
    );
    const data = await res.json();
    setUnfavesLoading(false);
    setUnfaves(data);
  };

  if (error) return "Something went wrong";

  const handleOpenModal = async () => {
    setShowModal(true);
    setShouldFetch(true);
    await getUnfaves();
  };

  const filteredResults = data?.filter(
    (item) =>
      item.name?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.description?.toLowerCase()?.includes(filter?.toLowerCase()) ||
      item.purchasedAt?.toLowerCase()?.includes(filter?.toLowerCase())
  );

  const type = tabs[activeTab];

  const handleUnfavorite = async (item) => {
    let itemType = "item";
    if (type === "containers") itemType = "container";
    if (type === "categories") itemType = "category";
    const updated = [...data];
    const optimistic = updated?.filter((i) => i.id != item.id);
    try {
      await mutate(
        `/homepage/api?type=${tabs[activeTab]}&favorite=true`,
        removeFavorite({
          type: itemType,
          id: item.id,
          favorite: false,
        }),
        {
          optimisticData: optimistic,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(`Removed ${item.name} from favorites`);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleDelete = async () => {
    const itemType = type === "categories" ? "category" : type.slice(0, -1);
    const updated = [...data];
    const optimistic = updated?.filter((i) => !selectedItems.includes(i.id));
    try {
      await mutate(
        `/homepage/api?type=${tabs[activeTab]}&favorite=true`,
        deleteMany({
          type: itemType,
          selected: selectedItems,
        }),
        {
          optimisticData: sortObjectArray(optimistic),
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      setShowDelete(false);
      setSelectedItems([]);
      toast.success(`Deleted ${selectedItems?.length} ${type}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleSelect = (item) => {
    if (showDelete) {
      setSelectedItems(
        selectedItems?.includes(item)
          ? selectedItems.filter((i) => i != item)
          : [...selectedItems, item]
      );
    }
  };

  const handleCancel = () => {
    setShowDelete(false);
    setSelectedItems([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUnfavesLoading(true);
    setUnfaves([]);
  };

  const handleAdd = async () => {
    const itemsToAdd = unfaves?.filter((i) => selectedItems.includes(i.id));
    const updated = [...data].concat(itemsToAdd);
    await mutate(
      `/homepage/api?type=${tabs[activeTab]}&favorite=true`,
      addFaves({
        type: type === "categories" ? "category" : type.slice(0, -1),
        list: selectedItems,
      }),
      {
        optimisticData: sortObjectArray(updated),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    setSelectedItems([]);
    setShowModal(false);
    setUnfaves([]);
  };

  return (
    <>
      <Header />
      <div className="pb-8 mt-[-1.7rem]">
        <h1 className="font-bold text-4xl py-4">Favorites</h1>
        <ViewToggle data={tabs} active={activeTab} setActive={setActiveTab} />
        <SearchFilter
          filter={filter}
          onChange={(e) => setFilter(e.target.value)}
          label={`Filter ${type} by name`}
        />
        <div className="mt-2">
          {isLoading ? (
            <Loading />
          ) : (
            <GridLayout>
              {filteredResults?.map((item) => {
                return item?.hasOwnProperty("containerId") ? (
                  <SquareItemCard
                    item={item}
                    key={v4()}
                    handleFavoriteClick={handleUnfavorite}
                    showDelete={showDelete}
                    isSelected={selectedItems?.includes(item.id)}
                    handleSelect={handleSelect}
                  />
                ) : (
                  <ColorCard
                    key={v4()}
                    item={item}
                    handleFavoriteClick={handleUnfavorite}
                    isContainer={item.hasOwnProperty("parentContainerId")}
                    showDelete={showDelete}
                    isSelected={selectedItems?.includes(item.id)}
                    handleSelect={handleSelect}
                    type={item?.type}
                  />
                );
              })}
            </GridLayout>
          )}
        </div>
        <ContextMenu
          onAdd={handleOpenModal}
          onDelete={() => setShowDelete(true)}
          showRemove={false}
          addLabel={`Add ${type} to favorites`}
          type={type}
        />
        {showDelete ? (
          <DeleteButtons
            handleDeleteItems={handleDelete}
            handleCancelItems={handleCancel}
            count={selectedItems.length}
            type={type}
          />
        ) : null}

        <AddModal
          type={type}
          close={handleCloseModal}
          data={data}
          opened={showModal}
          shouldFetch={shouldFetch}
          setShouldFetch={setShouldFetch}
          handleAdd={handleAdd}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          unfaves={unfaves}
          unfavesLoading={unfavesLoading}
        />
      </div>
    </>
  );
};

export default HomePage;
