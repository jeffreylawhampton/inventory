"use client";
import { useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { deleteCategory } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import EditCategory from "../EditCategory";
import { Pencil } from "lucide-react";
import { useUserData } from "@/app/hooks/useUserData";
import useSWR, { mutate } from "swr";

const fetcher = async (id) => {
  const res = await fetch(`/categories/api/${id}`);
  const data = await res.json();
  return data.category;
};

const Page = ({ params: { id } }) => {
  const [showEditCategory, setShowEditCategory] = useState(false);

  const { data, isLoading, error } = useSWR(`categories${id}`, () =>
    fetcher(id)
  );

  const { user } = useUserData("categories");

  if (isLoading) return <CircularProgress />;
  if (error) return <div>failed to load</div>;

  return (
    <div>
      {showEditCategory ? (
        <EditCategory
          data={data}
          setShowEditCategory={setShowEditCategory}
          id={id}
          user={user}
        />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil onClick={() => setShowEditCategory(true)} />
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
                await mutate("categories", deleteCategory({ id }), {
                  optimisticData: user?.categories?.filter(
                    (category) => category.id != id
                  ),
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
                toast.success("Category deleted");
              } catch (e) {
                toast.error("Something went wrong");
                throw e;
              }
            }}
          >
            Delete item
          </Button>
          <Button onPress={() => setShowEditCategory(true)}>Edit</Button>
        </>
      )}
    </div>
  );
};

export default Page;
