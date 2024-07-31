"use client";
import useSWR from "swr";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { fetcher } from "../lib/fetcher";
import Link from "next/link";
import CreateLocation from "./CreateLocation";

const Page = () => {
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR(`/locations/api`, fetcher);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const openModal = () => {
    onOpen();
  };
  if (fetchError) return <div>failed to load</div>;
  if (isLoading) return <Spinner />;

  const { locations } = data;
  return (
    <div>
      Locations
      <ul>
        {locations?.map((location) => {
          return (
            <li key={location.id}>
              <Link href={`locations/${location.id}`} className="block py-5">
                {location.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Button onPress={openModal}>Create new location</Button>
      <CreateLocation
        locations={locations}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        isOpen={isOpen}
      />
    </div>
  );
};

export default Page;
