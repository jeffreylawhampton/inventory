"use client";
import { useState } from "react";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import { deleteItem } from "../api/db";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import EditItem from "../EditItem";
import { Pencil } from "lucide-react";
import ItemCategories from "../ItemCategories";
import Image from "next/image";

const fetchItem = async (id) => {
  try {
    const res = await fetch(`/items/api/${id}`);
    const data = await res.json();
    return data.item;
  } catch (e) {
    throw new Error(e);
  }
};

const Page = ({ params: { id } }) => {
  const [showEditItem, setShowEditItem] = useState(false);

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["item"],
    queryFn: () => fetchItem(id),
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
      {showEditItem ? (
        <EditItem item={data} setShowEditItem={setShowEditItem} />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil onClick={() => setShowEditItem(true)} />
          </div>
          <ItemCategories item={data} />
          <div>{data?.description}</div>
          <div>{data?.quantity}</div>
          <div>{data?.value}</div>
          <div>{data?.purchasedAt}</div>
          <div>{data?.serialNumber}</div>
          <div>Location: {data?.location?.name}</div>
          <div>Container: {data?.container?.name}</div>
          {data?.images?.map((image) => (
            <Image
              key={image.url}
              alt=""
              width={250}
              height={250}
              src={image.url}
            />
          ))}
          <Button
            onPress={() => deleteItem({ id }).then(toast.success("Deleted"))}
          >
            Delete item
          </Button>
          <Button onPress={() => setShowEditItem(true)}>Edit</Button>
        </>
      )}
      <div></div>
    </div>
  );
};

export default Page;
