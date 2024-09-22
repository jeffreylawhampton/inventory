"use client";
import NewCategory from "./NewCategory";
import { useState, useContext } from "react";
import useSWR from "swr";
import { checkLuminance, sortObjectArray } from "../lib/helpers";
import SearchFilter from "../components/SearchFilter";
import { IconClipboardList } from "@tabler/icons-react";
import { Card } from "@mantine/core";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import Loading from "../components/Loading";
import { DeviceContext } from "../layout";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const {
    dimensions: { width },
  } = useContext(DeviceContext);
  const { data, error, isLoading } = useSWR("categories", fetcher);

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  let categoryList = [];
  if (data.length) {
    categoryList = data;
  }

  const filteredResults = sortObjectArray(categoryList).filter((category) =>
    category?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <h1 className="font-bold text-3xl pb-5 ">Categories</h1>
      <SearchFilter
        label={"Search for a category"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <div
        className={`grid ${
          width < 500 ? "grid-cols-1" : "grid-cols-2"
        }  md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 mt-3`}
      >
        {filteredResults.map((category) => {
          const count = category._count?.items;
          return (
            <Card
              padding={width < 500 ? "md" : width < 1600 ? "lg" : "xl"}
              component={category?.id ? "a" : null}
              href={`/categories/${category.id}`}
              styles={{
                root: {
                  backgroundColor: category?.color?.hex,
                  color: checkLuminance(category?.color?.hex),
                },
              }}
              classNames={{
                root: `hover:saturate-[140%] active:drop-shadow-none cursor-pointer`,
              }}
              key={category.name}
              radius="md"
            >
              <div className="flex w-full justify-between">
                <h2
                  className={`text-base lg:text-lg 2xl:text-xl font-semibold`}
                >
                  {category.name}
                </h2>
                <span className="flex gap-1 text-lg items-center font-medium">
                  <IconClipboardList /> {count}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
      <NewCategory
        categoryList={categoryList}
        opened={opened}
        close={close}
        open={open}
      />
      <CreateButton tooltipText={"Add new category"} onClick={open} />
    </>
  );
}
