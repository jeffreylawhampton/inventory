"use client";
import NewCategory from "./NewCategory";
import { useState, useContext } from "react";
import useSWR from "swr";
import { checkLuminance, sortObjectArray } from "../lib/helpers";
import SearchFilter from "../components/SearchFilter";
import {
  IconClipboardList,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { Card } from "@mantine/core";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import Loading from "../components/Loading";
import { DeviceContext } from "../layout";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import Link from "next/link";
import FavoriteFilterButton from "../components/FavoriteFilterButton";
import CountPills from "../components/CountPills";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const {
    dimensions: { width },
  } = useContext(DeviceContext);
  const { data, error, isLoading, mutate } = useSWR("categories", fetcher);

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  let categoryList = [];
  if (data.length) {
    categoryList = data;
  }

  let filteredResults = sortObjectArray(categoryList).filter((category) =>
    category?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((cat) => cat.favorite);
  }

  const handleFavoriteClick = async ({ category }) => {
    const add = !category.favorite;
    const categoryArray = [...data];
    const categoryToUpdate = categoryArray.find(
      (i) => i.name === category.name
    );
    categoryToUpdate.favorite = !category.favorite;

    try {
      await mutate(toggleFavorite({ type: "category", id: category.id, add }), {
        optimisticData: categoryArray,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${category.name} to favorites`
          : `Removed ${category.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  return (
    <>
      <h1 className="font-bold text-3xl pb-5">Categories</h1>
      <SearchFilter
        label={"Search for a category"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <FavoriteFilterButton
        label="Favorites"
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        rootClasses="mt-1 mb-4"
      />
      <div className="@container">
        <div
          className={`grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-2`}
        >
          {filteredResults.map((category) => {
            const count = category._count?.items;
            return (
              <Card
                padding={width < 500 ? "md" : width < 1600 ? "lg" : "xl"}
                href={`/categories/${category.id}`}
                styles={{
                  root: {
                    backgroundColor: category?.color?.hex,
                    color: checkLuminance(category?.color?.hex),
                  },
                }}
                classNames={{
                  root: `hover:saturate-[140%] active:drop-shadow-none cursor-pointer relative`,
                }}
                key={category.name}
                radius="md"
              >
                <Link
                  href={`/categories/${category?.id}`}
                  className="w-full h-full absolute top-0 left-0"
                />
                <div className="flex w-full justify-between @container items-center">
                  <span className="flex gap-1 overflow-x-hidden w-full items-center">
                    <h1 className="font-semibold @4xs:text-sm @2xs:text-base @sm:text-md text-nowrap overflow-hidden">
                      {category?.name}
                    </h1>
                    <div
                      className="relative  left-[-3px] p-[3px]"
                      onClick={() => handleFavoriteClick({ category })}
                    >
                      {category?.favorite ? (
                        <IconHeartFilled size={20} strokeWidth={2} />
                      ) : (
                        <IconHeart size={20} strokeWidth={2} />
                      )}
                    </div>
                  </span>

                  <CountPills showItems itemCount={count} transparent />
                </div>
              </Card>
            );
          })}
        </div>
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
