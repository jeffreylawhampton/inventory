"use client";
import { Button, Card, CardHeader, Spinner } from "@nextui-org/react";
import Image from "next/image";
import NewItem from "./NewItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const fetcher = async () => {
  const res = await fetch("/items/api");
  const data = await res.json();
  return data?.items;
};

const Page = () => {
  const router = useRouter();
  const [showAddItem, setShowAddItem] = useState(false);
  const { data, error, isLoading } = useSWR("items", fetcher);

  if (isLoading) return <Spinner />;
  if (error) return "Error";

  let itemList = [];
  if (data.length) {
    itemList = data.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      {showAddItem ? (
        <NewItem setShowAddItem={setShowAddItem} itemList={itemList} />
      ) : (
        <div>
          Items
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
            {itemList?.map((item) => {
              return (
                <Card
                  isPressable
                  onPress={() => router.push(`/items/${item.id}`)}
                  key={item.name}
                  className="py-3 bg-slate-400 overflow-hidden aspect-square"
                >
                  {item.images?.length ? (
                    <Image
                      alt=""
                      src={item?.images[0]?.url}
                      fill
                      objectFit="cover"
                    />
                  ) : null}
                  <CardHeader className="flex-col items-start">
                    <h2>{item.name}</h2>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <Button onPress={() => setShowAddItem(true)}>Create new item</Button>
        </div>
      )}
    </>
  );
};

export default Page;
