"use client";
import { useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { deleteContainer } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import EditContainer from "../EditContainer";
import useSWR, { mutate } from "swr";
import { Pencil } from "lucide-react";
import { useUser } from "@/app/hooks/useUser";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data.container;
};

const Page = ({ params: { id } }) => {
  const [showEditContainer, setShowEditContainer] = useState(false);
  const { user } = useUser();
  const { data, error, isLoading } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <CircularProgress aria-label="Loading" />;

  return (
    <div>
      {showEditContainer ? (
        <EditContainer
          data={data}
          setShowEditContainer={setShowEditContainer}
          id={id}
        />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil
              onClick={() => setShowEditContainer(true)}
              aria-label="Edit container"
            />
          </div>
          {data?.items?.map((item) => {
            return (
              <li key={item.name}>
                <Link prefetch={false} href={`/${item.id}`}>
                  {item.name}
                </Link>
              </li>
            );
          })}
          <Button
            onPress={async () => {
              try {
                await mutate("containers", deleteContainer({ id }), {
                  optimisticData: user?.containers?.filter(
                    (container) => container.id != id
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
            Delete container
          </Button>
          <Button onPress={() => setShowEditContainer(true)}>Edit</Button>
        </>
      )}
      <div></div>
    </div>
  );
};

export default Page;
