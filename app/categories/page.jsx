"use client";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Image,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import NewCategory from "./NewCategory";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { getFontColor } from "../lib/helpers";
import MasonryContainer from "../components/MasonryContainer";
import ItemCard from "../components/ItemCard";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";

const fetcher = async ({ sortBy }) => {
  const res = await fetch(`/categories/api?params=${sortBy}`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("categories", () =>
    fetcher({ sortBy: "oldest" })
  );
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
        label={"category"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <MasonryContainer desktopColumns={4} gutter={10}>
        {filteredResults?.map((category) => {
          const fontColor = getFontColor(category.color);
          return (
            <Accordion
              key={category.name}
              style={{ background: category.color }}
              className="rounded-lg"
            >
              <AccordionItem
                title={category.name}
                startContent={
                  <div
                    className={`bg-white bg-opacity-65 aspect-square h-8 flex items-center justify-center rounded-md font-semibold`}
                  >
                    {category.items?.length}
                  </div>
                }
                classNames={{
                  title: `${fontColor} font-medium`,
                  indicator: fontColor,
                  trigger: "p-0",
                  heading: "py-3 px-2",
                  content: "px-2",
                }}
              >
                <Link
                  className={`flex gap-2 ${fontColor} items-center`}
                  href={`/categories/${category.id}?name=${category.name}`}
                >
                  See all
                  <SquareArrowOutUpRight
                    aria-label="Link"
                    strokeWidth={2}
                    size={16}
                  />
                </Link>
                {category.items?.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      isPressable
                      onPress={() =>
                        router.push(`/items/${item.id}?name=${item.name}`)
                      }
                      radius="md"
                      className="mb-2 border-none bg-white"
                      shadow="sm"
                    >
                      <CardBody className="flex flex-row gap-2 items-center justify-center h-full overflow-hidden aspect-[5/1] p-1">
                        {item.images?.length ? (
                          <Image
                            alt="Album cover"
                            className="object-cover overflow-hidden h-full min-h-[100%] w-[20%] min-w-[20%]"
                            shadow="sm"
                            src={item?.images[0]?.url}
                            height={100}
                            width="20%"
                            removeWrapper
                          />
                        ) : null}

                        <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start justify-start h-full w-[80%]">
                          <h1 className="text-md font-semibold pb-1">
                            {item?.name}
                          </h1>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </AccordionItem>
            </Accordion>
          );
        })}
      </MasonryContainer>
      <NewCategory
        categoryList={categoryList}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
      />

      <CreateNewButton tooltipText={"Add new container"} onClick={onOpen} />
    </>
  );
}
