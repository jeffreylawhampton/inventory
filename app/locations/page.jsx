"use client";
import { Button, CircularProgress, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import NewLocation from "./NewLocation";
import useSWR from "swr";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data.locations;
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("locations", fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return "Something went wrong";

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  return (
    <div>
      <ul>
        {locationList.map((location) => (
          <Link href={`/locations/${location.id}`} key={location.id}>
            <li>{location.name}</li>
          </Link>
        ))}
      </ul>
      <NewLocation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        locationList={locationList}
      />
      <Button onPress={onOpen}>Create new location</Button>
    </div>
  );
}
