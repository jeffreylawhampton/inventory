"use client";
import { useState, useContext, useEffect } from "react";
import useSWR from "swr";
import {
  ContextMenu,
  FavoriteFilterButton,
  FilterButton,
  Loading,
  SearchFilter,
  ViewToggle,
  DeleteButtons,
  NewContainer,
} from "@/app/components";
import AllContainers from "./AllContainers";
import Nested from "./Nested";
import { toggleFavorite, deleteMany } from "../lib/db";
import toast from "react-hot-toast";
import { IconHeart, IconMapPin } from "@tabler/icons-react";
import { Pill, Button } from "@mantine/core";
import { v4 } from "uuid";
import { ContainerContext } from "./layout";
import { DeviceContext } from "../layout";
import Header from "../components/Header";
import { selectToggle } from "../lib/helpers";

const fetcher = async () => {
  const res = await fetch(`/containers/api`);
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [activeContainer, setActiveContainer] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [containerList, setContainerList] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("containers", fetcher);
  const { containerToggle, setContainerToggle } = useContext(ContainerContext);
  const { setCrumbs, setCurrentModal, open, close } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(null);
  }, [setCrumbs]);

  useEffect(() => {
    data && setContainerList([...data]);
  }, [data]);

  const handleCancel = () => {
    setSelectedContainers([]);
    setShowDelete(false);
  };

  const onCreateContainer = () => {
    setCurrentModal({
      component: (
        <NewContainer close={close} data={data} mutateKey="containers" />
      ),
      size: "lg",
      title: "Create a new container",
    });
    open();
  };

  const filterList = activeFilters.map((filter) => filter.id);

  let filtered = activeFilters?.length
    ? containerList.filter((container) =>
        filterList.includes(container.locationId)
      )
    : containerList;

  if (showFavorites) filtered = filtered?.filter((con) => con.favorite);

  const onClose = (location) => {
    setActiveFilters(activeFilters.filter((loc) => loc != location));
  };

  const handleClear = () => {
    setActiveFilters([]);
    setShowFavorites(false);
  };

  const handleItemFavoriteClick = async (item) => {
    const add = !item.favorite;
    const updated = [...data];
    const itemContainer = updated?.find(
      (container) => container.id === item.containerId
    );

    const itemToUpdate = itemContainer?.items?.find((i) => i.id === item.id);
    if (itemToUpdate) {
      itemToUpdate.favorite = add;
    }

    try {
      if (
        await mutate(toggleFavorite({ type: "item", id: item.id, add }), {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        })
      ) {
        setContainerList(updated);
        toast.success(
          add
            ? `Added ${item.name} to favorites`
            : `Removed ${item.name} from favorites`
        );
      }
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleSelect = (containerId) => {
    if (showDelete) {
      selectToggle({
        value: containerId,
        list: selectedContainers,
        setList: setSelectedContainers,
      });
    } else {
      setActiveContainer(activeContainer === containerId ? null : containerId);
    }
  };

  const handleDelete = async () => {
    const optimistic = structuredClone(data)?.filter(
      (c) => !selectedContainers.includes(c.id)
    );
    try {
      await mutate(
        deleteMany({ selected: selectedContainers, type: "container" }),
        {
          optimisticData: optimistic,
          populateCache: false,
          revalidate: true,
          rollbackOnError: true,
        }
      );
      setSelectedContainers([]);
      setShowDelete(false);
      toast.success(
        `Deleted ${selectedContainers?.length} ${
          selectedContainers?.length === 1 ? "container" : "containers"
        }`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const handleContainerFavoriteClick = async (container) => {
    const add = !container.favorite;
    const containerArray = [...data];
    const containerToUpdate = containerArray.find(
      (i) => i.name === container.name
    );
    containerToUpdate.favorite = !container.favorite;

    try {
      if (
        await mutate(
          toggleFavorite({ type: "container", id: container.id, add }),
          {
            optimisticData: containerArray,
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        )
      ) {
        setContainerList(containerArray);
        toast.success(
          add
            ? `Added ${container.name} to favorites`
            : `Removed ${container.name} from favorites`
        );
      }
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <>
      <Header />
      <div className="pb-8 mt-[-1.7rem]">
        <h1 className="font-bold text-4xl pb-6">Containers</h1>
        <ViewToggle
          active={containerToggle}
          setActive={setContainerToggle}
          data={["Nested", "All"]}
        />
        {containerToggle ? (
          <SearchFilter
            label={"Filter by name"}
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
        ) : null}

        {containerToggle === 1 ? (
          <div className="flex gap-3 mb-2 mt-1">
            <FilterButton
              filters={activeFilters}
              setFilters={setActiveFilters}
              label="Locations"
              countItem="containers"
              onClose={onClose}
            />
            <FavoriteFilterButton
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
              label="Favorites"
            />
          </div>
        ) : null}
        <div className="flex gap-2 !items-center flex-wrap mb-5 mt-3">
          {activeFilters?.map((location) => {
            return (
              <Pill
                key={v4()}
                withRemoveButton
                onRemove={() =>
                  setActiveFilters(
                    activeFilters.filter((loc) => loc.name != location.name)
                  )
                }
                size="sm"
                classNames={{
                  label: "font-semibold lg:p-1 flex gap-[2px] items-center",
                }}
                styles={{
                  root: {
                    height: "fit-content",
                  },
                }}
              >
                <IconMapPin aria-label="Location" size={16} />
                {location?.name}
              </Pill>
            );
          })}
          {showFavorites ? (
            <Pill
              key={v4()}
              withRemoveButton
              onRemove={() => setShowFavorites(false)}
              size="sm"
              classNames={{
                label: "font-semibold lg:p-1 flex gap-[2px] items-center",
              }}
              styles={{
                root: {
                  height: "fit-content",
                },
              }}
            >
              <IconHeart aria-label="Favorite" size={16} />
              Favorites
            </Pill>
          ) : null}
          {activeFilters?.length > 1 ? (
            <Button variant="subtle" onClick={handleClear} size="xs">
              Clear all
            </Button>
          ) : null}
        </div>

        {containerToggle === 0 ? (
          <Nested
            containerList={data}
            mutate={mutate}
            handleContainerFavoriteClick={handleContainerFavoriteClick}
            handleItemFavoriteClick={handleItemFavoriteClick}
            data={data}
            showFavorites={showFavorites}
            activeFilters={activeFilters}
            selectedContainers={selectedContainers}
            handleSelect={handleSelect}
            activeContainer={activeContainer}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
          />
        ) : (
          <AllContainers
            containerList={filtered}
            filter={filter}
            handleContainerFavoriteClick={handleContainerFavoriteClick}
            handleSelect={handleSelect}
            selectedContainers={selectedContainers}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
          />
        )}

        <ContextMenu
          onDelete={() => setShowDelete(true)}
          onCreateContainer={onCreateContainer}
          showRemove={false}
          type="containers"
        />

        {showDelete ? (
          <DeleteButtons
            handleCancelItems={handleCancel}
            handleDeleteItems={handleDelete}
            type="containers"
            count={selectedContainers?.length}
          />
        ) : null}
      </div>
    </>
  );
}
