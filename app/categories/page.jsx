"use client";
import { Button, CircularProgress, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewCategory from "./NewCategory";

const fetchAllCategories = async () => {
  try {
    const res = await fetch("/categories/api");
    const data = await res.json();
    return data?.categories;
  } catch (e) {
    throw new Error(e);
  }
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  if (isPending) return <CircularProgress />;
  if (error) return "Something went wrong";

  return (
    <div>
      <ul>
        {data?.map((category) => (
          <Link
            href={`/categories/${category.id}`}
            key={category.id}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["category"] })
            }
          >
            <li>{category.name}</li>
          </Link>
        ))}
      </ul>
      <NewCategory
        category={data}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
      <Button onPress={onOpen}>Create new category</Button>
    </div>
  );
}
