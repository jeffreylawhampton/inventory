"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  CardToggle,
  ContainerForm,
  ContextMenu,
  EditContainer,
  FavoriteFilterButton,
  FilterButton,
  FilterPill,
  Header,
  Loading,
  NewContainer,
  SearchFilter,
  ViewToggle,
} from "@/app/components";
import AllContainers from "./AllContainers";
import DeleteButtons from "./DeleteButtons";
import Nested from "./Nested";
import { Button } from "@mantine/core";
import { v4 } from "uuid";
import { DeviceContext } from "../providers";
import {
  fetcher,
  getFilterCounts,
  handleToggleDelete,
  handleToggleSelect,
} from "../lib/helpers";
import {
  handleNestedItemFavoriteClick,
  handleContainerFavorite,
} from "./handlers";
import { LocationIcon } from "@/app/assets";
import { groupBy } from "lodash";
import { deleteMany, deleteObject } from "../lib/db";
import { mutateProps, notify } from "../lib/handlers";
import EditItem from "./[id]/EditListItem";
import { updateContainer } from "./api/db";

export default function Page() {
  const mutateKey = "/containers/api";
  const [locationFilters, setLocationFilters] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [formError, setFormError] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const { data, error, isLoading } = useSWR(mutateKey, fetcher);
  const {
    isMobile,
    setCurrentModal,
    open,
    close,
    containerToggle,
    setContainerToggle,
    showDelete,
    setShowDelete,
  } = useContext(DeviceContext);

  const handleCancel = () => {
    setSelectedContainers([]);
    setShowDelete(false);
  };

  const onCreateContainer = () => {
    setCurrentModal({
      component: (
        <NewContainer close={close} data={data} mutateKey={mutateKey} />
      ),
      size: "lg",
      title: "Create a new container",
    });
    open();
  };

  const router = useRouter();

  const locationFilterOptions = getFilterCounts(data, "location");

  const filterList = locationFilters.map((filter) => filter.id);

  let filtered = locationFilters?.length
    ? data?.filter((container) => filterList.includes(container.locationId))
    : data;

  if (showFavorites) filtered = filtered?.filter((con) => con.favorite);

  const onLocationClose = (locId) => {
    setLocationFilters(
      locationFilters.filter((location) => location.id != locId)
    );
  };

  const handleClear = () => {
    setLocationFilters([]);
    setShowFavorites(false);
  };

  const handleItemFavoriteClick = (item) => {
    return handleNestedItemFavoriteClick({ data, item, mutateKey });
  };

  const handleContainerFavoriteClick = (container) => {
    return handleContainerFavorite({ container, data, mutateKey });
  };

  const handleSelect = (containerId) => {
    handleToggleSelect(containerId, selectedContainers, setSelectedContainers);
  };

  const handleContainerSubmit = async (editedContainer) => {
    close();
    try {
      await mutate(mutateKey, updateContainer(editedContainer), {
        optimisticData: data?.map((c) =>
          c.id === editedContainer.id ? editedContainer : { ...c }
        ),
        ...mutateProps,
      });
      notify({ message: `Updated ${editedContainer.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  const handleEditClick = (container) => {
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

  const handleDeleteClick = async (container) => {
    if (confirm(`Delete ${container?.name}?`)) {
      try {
        await mutate(
          mutateKey,
          deleteObject({ id: container.id, type: "container" }),
          {
            optimisticData: data?.filter((c) => c.id != container.id),
            rollbackOnError: true,
            revalidate: true,
            populateCache: false,
          }
        );
        notify({ message: `Deleted ${container.name}` });
      } catch (e) {
        notify({ isError: true });
        throw new Error(e);
      }
    }
  };

  const handleDeleteItemClick = async (item) => {
    if (confirm(`Delete ${item?.name}?`)) {
      try {
        await mutate(mutateKey, deleteObject({ id: item.id, type: "item" }), {
          optimisticData: data?.map((c) =>
            c.id === item.containerId
              ? { ...c, items: c.items?.filter((i) => i.id != item.id) }
              : { ...c }
          ),
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

  const handleClick = (item) => {
    showDelete
      ? handleToggleDelete(
          item,
          "name",
          selectedContainers,
          setSelectedContainers
        )
      : router.push(
          `/${item?.hasOwnProperty("containerId") ? "items" : "containers"}/${
            item.id
          }`
        );
  };

  const handleEditItemClick = (item) => {
    setCurrentModal({
      component: (
        <EditItem
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

  const handleDeleteMany = async () => {
    const split = groupBy(selectedContainers, "type");
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
      notify({ message: `Deleted ${selectedContainers?.count} objects` });
    } catch (e) {
      throw new Error(e);
    } finally {
      setSelectedContainers([]);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <>
      <Header />
      <div className="pb-32">
        <h1 className="font-bold text-4xl pt-8 pb-4">Containers</h1>
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

        <div className="flex gap-3 mb-2 mt-1">
          <CardToggle containerToggle={containerToggle} />
          {containerToggle === 1 ? (
            <>
              <FilterButton
                filters={locationFilters}
                setFilters={setLocationFilters}
                label="Locations"
                options={locationFilterOptions}
              />
              <FavoriteFilterButton
                showFavorites={showFavorites}
                setShowFavorites={setShowFavorites}
                label="Favorites"
              />
            </>
          ) : null}
        </div>

        <div className="flex gap-1 !items-center flex-wrap mb-5 mt-3 ">
          {locationFilters?.map((location) => {
            return (
              <FilterPill
                key={v4()}
                item={location}
                onClose={onLocationClose}
                icon={<LocationIcon width={10} showBottom={false} />}
              />
            );
          })}

          {showFavorites ? <FilterPill onClose={setShowFavorites} /> : null}
          {locationFilters?.length > 1 ? (
            <Button variant="subtle" onClick={handleClear} size="xs">
              Clear all
            </Button>
          ) : null}
        </div>

        {containerToggle === 0 ? (
          <Nested
            handleContainerFavoriteClick={handleContainerFavoriteClick}
            handleItemFavoriteClick={handleItemFavoriteClick}
            handleEditClick={handleEditClick}
            data={data}
            selectedContainers={selectedContainers}
            setSelectedContainers={setSelectedContainers}
            handleSelect={handleSelect}
            mutateKey={mutateKey}
            handleEditItemClick={handleEditItemClick}
            handleDeleteClick={handleDeleteClick}
            handleDeleteItemClick={handleDeleteItemClick}
            handleClick={handleClick}
            isMobile={isMobile}
          />
        ) : (
          <AllContainers
            containerList={filtered}
            data={data}
            filter={filter}
            handleContainerFavoriteClick={handleContainerFavoriteClick}
            handleSelect={handleSelect}
            handleEditClick={handleEditClick}
            selectedContainers={selectedContainers}
            setSelectedContainers={setSelectedContainers}
            handleDeleteClick={handleDeleteClick}
            handleClick={handleClick}
          />
        )}

        <ContextMenu
          onDelete={() => setShowDelete(true)}
          onCreateContainer={onCreateContainer}
          showRemove={false}
          type="containers"
          deleteLabel="multiple"
        />

        {showDelete ? (
          <DeleteButtons
            handleCancel={handleCancel}
            handleDelete={handleDeleteMany}
            count={selectedContainers?.length}
          />
        ) : null}
      </div>
    </>
  );
}
