"use client";
import { Button, Card, CardHeader, CircularProgress } from "@nextui-org/react";
import Image from "next/image";
import NewItem from "./NewItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { v4 } from "uuid";

const fetchAllItems = async () => {
  try {
    const res = await fetch("/items/api");
    const data = await res.json();
    return data?.items;
  } catch (e) {
    throw new Error(e);
  }
};

const Page = () => {
  const router = useRouter();
  const [showAddItem, setShowAddItem] = useState(false);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["items"],
    queryFn: fetchAllItems,
  });

  if (isPending) return <CircularProgress />;
  if (error) return "Something went wrong";

  return (
    <>
      {showAddItem ? (
        <NewItem setShowAddItem={setShowAddItem} />
      ) : (
        <div>
          Items
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
            {data?.map((item) => {
              return (
                <Card
                  isPressable
                  onPress={() => router.push(`/items/${item.id}`)}
                  key={v4()}
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
