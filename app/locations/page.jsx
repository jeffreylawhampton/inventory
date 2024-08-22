"use client";
import {
  Card,
  CircularProgress,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import NewLocation from "./NewLocation";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";
import ItemGrid from "../components/ItemGrid";
import { sortObjectArray } from "../lib/helpers";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data.locations;
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("locations", fetcher);
  const [filter, setFilter] = useState("");

  const router = useRouter();

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    location?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <SearchFilter
        label={"Search for a location"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <ItemGrid>
        {filteredResults?.map((location) => {
          const containerCount = location._count?.containers;
          const itemCount = location._count?.items;
          return (
            <Card
              key={location.name}
              id={location.id}
              classNames={{
                base: "shadow-md bg-gray-100 p-6",
              }}
              isPressable
              isHoverable
              onPress={() =>
                router.push(`/locations/${location.id}?name=${location.name}`)
              }
            >
              <h2 className="font-semibold text-lg">{location.name}</h2>
              <p>
                {containerCount}{" "}
                {containerCount == 1 ? "container" : "containers"}
              </p>
              <p>
                {itemCount} {itemCount == 1 ? "item" : "items"}
              </p>

              <Button>Peek</Button>
            </Card>
          );
        })}
      </ItemGrid>
      <NewLocation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        locationList={locationList}
      />
      <div className="absolute bottom-10 right-10">
        <CreateNewButton tooltipText="Create new location" onClick={onOpen} />
      </div>
    </>
  );
}
