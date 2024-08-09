"use client";
import { useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { deleteCategory } from "../api/db";
import toast from "react-hot-toast";
import EditCategory from "../EditCategory";
import { Pencil } from "lucide-react";
import { useUserData } from "@/app/hooks/useUserData";
import useSWR, { mutate } from "swr";
import ItemCard from "@/app/components/ItemCard";

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

  if (isLoading) return <CircularProgress aria-label="Loading" />;
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
            <Pencil
              onClick={() => setShowEditCategory(true)}
              aria-label="Edit category"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 grow">
            {data?.items
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => {
                return <ItemCard key={item.name} item={item} />;
              })}
          </div>
          <Button
            color="danger"
            onPress={async () => {
              if (
                !confirm(
                  `Are you sure you want to delete ${
                    data?.name || "this category"
                  }?`
                )
              )
                return;
              try {
                await mutate("categories", deleteCategory({ id }), {
                  optimisticData: user?.categories?.filter(
                    (category) => category.id != id
                  ),
                  rollbackOnError: true,
                  populateCache: false,
                  revalidate: true,
                });
                toast.success(`Successfully deleted ${data.name}`);
              } catch (e) {
                toast.error("Something went wrong");
                throw e;
              }
            }}
          >
            Delete category
          </Button>
          <Button onPress={() => setShowEditCategory(true)}>Edit</Button>
        </>
      )}
    </div>
  );
};

export default Page;
