"use client";
import { useState, useContext, useEffect } from "react";
import NewContainer from "./NewContainer";
import useSWR, { mutate } from "swr";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import ViewToggle from "../components/ViewToggle";
import Loading from "../components/Loading";
import { AccordionContext } from "../layout";
import AllContainers from "./AllContainers";
import Nested from "./Nested";
import SearchFilter from "../components/SearchFilter";
import FilterButton from "../components/FilterButton";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import FavoriteFilterButton from "../components/FavoriteFilterButton";
import { IconHeart, IconMapPin } from "@tabler/icons-react";
import { Pill, Button } from "@mantine/core";
import { v4 } from "uuid";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const { data, error, isLoading } = useSWR("containers", fetcher);
  const { containerToggle, setContainerToggle } = useContext(AccordionContext);

  let containerList = [];
  if (data?.length) {
    containerList = data;
  }

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

  const handleFavoriteClick = async (container) => {
    const add = !container.favorite;
    const containers = [...filtered];
    const containerToUpdate = containers?.find(
      (con) => con.id === container.id
    );
    containerToUpdate.favorite = add;

    try {
      await mutate(
        "containers",
        toggleFavorite({
          type: "container",
          id: container.id,
          add,
        }),
        {
          optimisticData: containers,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
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

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div className="pb-8 xl:pt-8">
      <h1 className="font-bold text-3xl pb-5">Containers</h1>

      <ViewToggle
        active={containerToggle}
        setActive={setContainerToggle}
        data={["Nested", "All"]}
      />
      {containerToggle ? (
        <SearchFilter
          label={"Search for a container"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />
      ) : null}

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
          containerList={filtered}
          mutate={mutate}
          handleFavoriteClick={handleFavoriteClick}
        />
      ) : (
        <AllContainers
          containerList={filtered}
          filter={filter}
          handleFavoriteClick={handleFavoriteClick}
        />
      )}

      <NewContainer
        opened={opened}
        close={close}
        containerList={containerList}
        mutateKey="containers"
      />

      <CreateButton tooltipText="Create new container" onClick={open} />
    </div>
  );
}
