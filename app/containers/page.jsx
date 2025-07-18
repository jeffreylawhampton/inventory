"use client";
import { useState, useContext, useEffect } from "react";
import useSWR from "swr";
import {
  CardToggle,
  ContextMenu,
  DeleteButtons,
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
import Nested from "./Nested";
import { Button } from "@mantine/core";
import { v4 } from "uuid";
import { ContainerContext } from "./layout";
import { DeviceContext } from "../providers";
import { fetcher, getFilterCounts, handleToggleSelect } from "../lib/helpers";
import {
  handleDeleteMany,
  handleNestedItemFavoriteClick,
  handleAllContainerFavorite,
} from "./handlers";
import { LocationIcon } from "@/app/assets";

export default function Page() {
  const [locationFilters, setLocationFilters] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [activeContainer, setActiveContainer] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [containerList, setContainerList] = useState([]);
  const { data, error, isLoading } = useSWR("/containers/api", fetcher);
  const { containerToggle, setContainerToggle } = useContext(ContainerContext);
  const { setCurrentModal, open, close } = useContext(DeviceContext);

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
        <NewContainer close={close} data={data} mutateKey="/containers/api" />
      ),
      size: "lg",
      title: "Create a new container",
    });
    open();
  };

  const locationFilterOptions = getFilterCounts(data, "location");

  const filterList = locationFilters.map((filter) => filter.id);

  let filtered = locationFilters?.length
    ? containerList.filter((container) =>
        filterList.includes(container.locationId)
      )
    : containerList;

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
    return handleNestedItemFavoriteClick({ data, item, setContainerList });
  };

  const handleContainerFavoriteClick = (container) => {
    return handleAllContainerFavorite({ container, data, setContainerList });
  };

  const handleSelect = (containerId) => {
    if (showDelete) {
      handleToggleSelect(
        containerId,
        selectedContainers,
        setSelectedContainers
      );
    } else {
      setActiveContainer(activeContainer === containerId ? null : containerId);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <>
      <Header />
      <div className="pb-32 lg:pb-8">
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

        {containerToggle === 1 ? (
          <div className="flex gap-3 mb-2 mt-1">
            <CardToggle />
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
          </div>
        ) : null}

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
            data={data}
            selectedContainers={selectedContainers}
            handleSelect={handleSelect}
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
            handleDeleteItems={() =>
              handleDeleteMany({
                setShowDelete,
                selectedContainers,
                setSelectedContainers,
                data,
                mutateKey: "/containers/api",
              })
            }
            type="containers"
            count={selectedContainers?.length}
          />
        ) : null}
      </div>
    </>
  );
}
