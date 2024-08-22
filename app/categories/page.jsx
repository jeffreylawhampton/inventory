"use client";
import {
  Card,
  CardBody,
  CircularProgress,
  useDisclosure,
} from "@nextui-org/react";
import NewCategory from "./NewCategory";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { getFontColor } from "../lib/helpers";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";
import ItemGrid from "../components/ItemGrid";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [filter, setFilter] = useState("");

  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("categories", fetcher);

  const router = useRouter();
  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let categoryList = [];
  if (data.length) {
    categoryList = data;
  }

  const filteredResults = categoryList.filter((category) =>
    category?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <SearchFilter
        label={"Search for a category"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <ItemGrid desktop={4} gap={4}>
        {filteredResults.map((category) => {
          const count = category._count?.items;
          return (
            <Card
              style={{
                backgroundColor: category?.color,
              }}
              classNames={{
                base: `p-4 ${getFontColor(
                  category.color
                )} w-full overflow-visible drop-shadow hover:saturate-[140%] active:drop-shadow-none`,
              }}
              key={category.name}
              radius="lg"
              isPressable
              isHoverable
              onPress={() =>
                router.replace(
                  `/categories/${category.id}?name=${category.name}`
                )
              }
            >
              <CardBody>
                <h2 className={`text-xl font-semibold`}>{category.name}</h2>
                <p className="text-base ">
                  {category._count?.items} {count == 1 ? "item" : "items"}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </ItemGrid>
      <NewCategory
        categoryList={categoryList}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
      />
      <CreateNewButton tooltipText={"Add new category"} onClick={onOpen} />
    </>
  );
}
