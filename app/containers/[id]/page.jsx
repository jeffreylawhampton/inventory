"use client";
import { useState } from "react";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import { deleteContainer } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import EditContainer from "../EditContainer";
import { Pencil } from "lucide-react";

const fetchContainer = async (id) => {
  try {
    const res = await fetch(`/containers/api/${id}`);
    const data = await res.json();
    return data.container;
  } catch (e) {
    throw new Error(e);
  }
};

const Page = ({ params: { id } }) => {
  const [showEditContainer, setShowEditContainer] = useState(false);

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["container"],
    queryFn: () => fetchContainer(id),
  });

  if (isFetching)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>failed to load</div>;
  if (isLoading) return <Spinner />;

  return (
    <div>
      {showEditContainer ? (
        <EditContainer
          data={data}
          setShowEditContainer={setShowEditContainer}
        />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil onClick={() => setShowEditContainer(true)} />
          </div>
          {data?.items?.map((item) => {
            return (
              <li key={item.name}>
                <Link href={`/${item.id}`}>{item.name}</Link>
              </li>
            );
          })}
          <Button
            onPress={() => deleteContainer(id).then(toast.success("Deleted"))}
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
