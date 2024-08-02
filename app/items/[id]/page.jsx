"use client";
import { useState } from "react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { deleteItem } from "../api/db";
import toast from "react-hot-toast";
import EditItem from "../EditItem";
import { Pencil } from "lucide-react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";

const fetcher = async (id) => {
  const res = await fetch(`/items/api/${id}`);
  const data = await res.json();
  return data.item;
};

const Page = ({ params: { id } }) => {
  const [showEditItem, setShowEditItem] = useState(false);
  const { user } = useUser();

  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));
  if (error) return <div>failed to load</div>;
  if (isLoading) return <Spinner />;

  return (
    <div>
      {showEditItem ? (
        <EditItem
          item={data}
          setShowEditItem={setShowEditItem}
          user={user}
          id={id}
        />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil onClick={() => setShowEditItem(true)} />
          </div>

          {data?.categories
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => {
              return (
                <Chip
                  style={{ backgroundColor: category?.color, color: "white" }}
                  key={category?.name}
                >
                  {category?.name}
                </Chip>
              );
            })}
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
            onPress={async () => {
              try {
                await mutate("items", deleteItem({ id }), {
                  optimisticData: user?.items?.filter((item) => item.id != id),
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
              } catch (e) {
                toast.error("Something went wrong");
                throw e;
              }
            }}
          >
            Delete item
          </Button>
          <Button
            onPress={() => {
              setShowEditItem(true);
            }}
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default Page;
