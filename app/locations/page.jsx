"use client";
import {
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  CircularProgress,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import NewLocation from "./NewLocation";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import MasonryContainer from "../components/MasonryContainer";
import { SquareArrowOutUpRight } from "lucide-react";
import { Fragment, useState } from "react";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data.locations;
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("locations", fetcher);
  const [filter, setFilter] = useState("");

  const router = useRouter();

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  const filteredResults = locationList.filter((location) =>
    location?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <SearchFilter
        label={"location"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <MasonryContainer desktopColumns={3} gutter={12}>
        {filteredResults?.map((location) => {
          return (
            <Accordion
              key={location.name}
              className="rounded-lg drop-shadow-sm bg-gray-200"
            >
              <AccordionItem
                aria-label={location.name}
                title={location.name}
                startContent={
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-lg">
                    {location.items && location.items.length}
                  </div>
                }
                classNames={{
                  title: "font-semibold",
                  content: "",
                  base: "py-1 pl-1 pr-3",
                }}
              >
                <div className="flex flex-col gap-2 ">
                  <Link
                    className="flex gap-3 items-center"
                    href={`/locations/${location.id}?name=${location.name}`}
                  >
                    Go to {location.name.toLowerCase()}
                    <SquareArrowOutUpRight
                      size={18}
                      strokeWidth={2}
                      aria-label="External link"
                    />
                  </Link>

                  {location?.containers?.map((container) => {
                    return (
                      <Fragment key={container.name}>
                        <h2>Containers</h2>
                        <Accordion key={container.name}>
                          <AccordionItem
                            aria-label={container.name}
                            title={container.name}
                            classNames={{
                              heading: "bg-slate-500",
                            }}
                          >
                            {container.items?.map((item) => {
                              return (
                                <Card
                                  key={item.name}
                                  className="w-full rounded-lg shadow-md"
                                  isPressable
                                  onPress={() =>
                                    router.push(
                                      `/items/${item.id}?name=${item.name}`
                                    )
                                  }
                                >
                                  <CardHeader className="font-semibold">
                                    {item.name}
                                  </CardHeader>
                                </Card>
                              );
                            })}
                          </AccordionItem>
                        </Accordion>
                      </Fragment>
                    );
                  })}
                  {location?.items?.map((item) => {
                    return (
                      <Card
                        key={item.name}
                        className="w-full rounded-lg shadow-md"
                        isPressable
                        onPress={() =>
                          router.push(`/items/${item.id}?name=${item.name}`)
                        }
                      >
                        <CardHeader className="font-semibold">
                          {item.name}
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </AccordionItem>
            </Accordion>
          );
        })}
      </MasonryContainer>
      <NewLocation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        locationList={locationList}
      />
      <CreateNewButton tooltipText="Create new location" onClick={onOpen} />
    </>
  );
}
