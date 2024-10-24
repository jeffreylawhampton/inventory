"use client";
import NewCategory from "./NewCategory";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import useSWR from "swr";
import { getTextColor, sortObjectArray } from "../lib/helpers";
import SearchFilter from "../components/SearchFilter";
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
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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

  const router = useRouter();

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

  const handleCategoryClick = (category) => {
    router.push(`/categories/${category.id}`);
  };

  const handleFavoriteClick = async (category) => {
    console.log("cat", category);
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
      <h1 className="font-bold text-3xl pb-5 pt-8">Categories</h1>
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

      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          700: 2,
          1200: 3,
          1400: 4,
          2200: 5,
        }}
      >
        <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
          {filteredResults.map((category) => {
            const count = category._count?.items;
            return (
              <Card
                padding={width < 500 ? "md" : width < 1600 ? "lg" : "xl"}
                href={`/categories/${category.id}`}
                styles={{
                  root: {
                    backgroundColor: category?.color?.hex,
                    color: getTextColor(category?.color?.hex),
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
                  <h1 className="mr-3 font-semibold @4xs:text-sm @2xs:text-base @sm:text-md text-wrap !break-words hyphens-auto">
                    {category?.name}
                  </h1>

                  <CountPills
                    showItems
                    itemCount={count}
                    transparent
                    showFavorite
                    handleFavoriteClick={handleFavoriteClick}
                    handleCategoryClick={handleCategoryClick}
                    item={category}
                  />
                </div>
              </Card>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
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
