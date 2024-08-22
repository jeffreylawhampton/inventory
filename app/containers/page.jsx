"use client";
import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  useDisclosure,
} from "@nextui-org/react";
import { PackageOpen, MapPin } from "lucide-react";
import NewContainer from "./NewContainer";
import useSWR from "swr";
import { useState } from "react";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";
import { useRouter } from "next/navigation";
import { sortObjectArray } from "../lib/helpers";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const { data, error, isLoading } = useSWR("containers", fetcher);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let containerList = [];
  if (data?.length) {
    containerList = data;
  }
  const filteredResults = sortObjectArray(containerList).filter((container) =>
    container?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <div>
      <SearchFilter
        label={"Search for a container"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {filteredResults?.map((container) => {
          return (
            <Card
              key={container.name}
              id={container.id}
              classNames={{
                base: "shadow-md bg-gray-100 p-6",
              }}
              isPressable
              onPress={() =>
                router.push(
                  `/containers/${container.id}?name=${container.name}`
                )
              }
            >
              <CardHeader className="p-0 mb-3">
                <h2 className="font-semibold text-xl">{container.name}</h2>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 p-0">
                <span className="flex gap-3">
                  <PackageOpen aria-label="Parent container" />
                  {container?.parentContainer?.name}
                </span>
                <span className="flex gap-3">
                  <MapPin aria-label="Location" />{" "}
                  <p className="text-medium">{container?.location?.name}</p>
                </span>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <NewContainer
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        isOpen={isOpen}
        containerList={containerList}
      />

      <CreateNewButton tooltipText="Create new container" onClick={onOpen} />
    </div>
  );
}
