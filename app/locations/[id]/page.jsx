"use client";
import { useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { deleteLocation } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import EditLocation from "../EditLocation";
import { Pencil } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";

const fetcher = async (id) => {
  const res = await fetch(`/locations/api/${id}`);
  const data = await res.json();
  return data.location;
};

const Page = ({ params: { id } }) => {
  const [showEditLocation, setShowEditLocation] = useState(false);

  const { data, error, isLoading } = useSWR(`location${id}`, () => fetcher(id));
  const { user } = useUser();

  if (error) return "Failed to fetch";
  if (isLoading) return <CircularProgress />;

  return (
    <div>
      {showEditLocation ? (
        <EditLocation
          data={data}
          setShowEditLocation={setShowEditLocation}
          id={id}
        />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil
              onClick={() => setShowEditLocation(true)}
              aria-label="Edit location"
            />
          </div>
          {data?.items?.map((item) => {
            return (
              <li key={item.name}>
                <Link href={`/${item.id}`}>{item.name}</Link>
              </li>
            );
          })}
          <Button
            onPress={async () => {
              try {
                await mutate("locations", deleteLocation({ id }), {
                  optimisticData: user?.locations?.filter(
                    (location) => location.id != id
                  ),
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
                toast.success("Deleted");
              } catch (e) {
                toast.error("Something went wrong");
                throw e;
              }
            }}
          >
            Delete location
          </Button>
          <Button onPress={() => setShowEditLocation(true)}>Edit</Button>
        </>
      )}
    </div>
  );
};

export default Page;
