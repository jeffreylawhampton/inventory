"use client";
import { Button, CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import NewCategory from "./NewCategory";
import useSWR from "swr";
import { useState } from "react";

const fetcher = async () => {
  const res = await fetch("/categories/api");
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { data, error, isLoading } = useSWR("categories", fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return "Something went wrong";

  let categoryList = [];
  if (data.length) {
    categoryList = data;
  }

  return (
    <div>
      {showNewCategory ? (
        <NewCategory
          categoryList={categoryList}
          setShowNewCategory={setShowNewCategory}
        />
      ) : (
        <>
          <ul>
            {categoryList?.map((category) => (
              <Link
                href={`/categories/${category.id}`}
                key={category.id}
                prefetch={false}
              >
                <li>{category.name}</li>
              </Link>
            ))}
          </ul>
          <Button onPress={() => setShowNewCategory(true)}>
            Create new category
          </Button>
        </>
      )}
    </div>
  );
}
