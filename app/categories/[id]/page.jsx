"use client";
import { useState } from "react";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import { deleteCategory } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import EditCategory from "../EditCategory";
import { Pencil } from "lucide-react";

const fetchCategory = async (id) => {
  try {
    const res = await fetch(`/categories/api/${id}`);
    const data = await res.json();
    return data.category;
  } catch (e) {
    throw new Error(e);
  }
};

const Page = ({ params: { id } }) => {
  const [showEditCategory, setShowEditCategory] = useState(false);

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetchCategory(id),
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
      {showEditCategory ? (
        <EditCategory data={data} setShowEditCategory={setShowEditCategory} />
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
            onPress={() =>
              deleteCategory({ id }).then(toast.success("Deleted"))
            }
          >
            Delete category
          </Button>
          <Button onPress={() => setShowEditCategory(true)}>Edit</Button>
        </>
      )}
      <div></div>
    </div>
  );
};

export default Page;
