"use client";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import Link from "next/link";
import NewContainer from "./NewContainer";
import useSWR from "swr";
import { useState } from "react";
import CreateNewButton from "../components/CreateNewButton";
import SearchFilter from "../components/SearchFilter";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const { data, error, isLoading } = useSWR("containers", fetcher);
  const [showNewContainer, setShowNewContainer] = useState(false);

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Something went wrong";

  let containerList = [];
  if (data?.length) {
    containerList = data;
  }
  const filteredResults = containerList.filter((container) =>
    container?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <div>
      {showNewContainer ? (
        <NewContainer
          setShowNewContainer={setShowNewContainer}
          containerList={containerList}
        />
      ) : (
        <>
          <SearchFilter
            label={"container"}
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
          <ul>
            {filteredResults?.map((container) => (
              <Link
                href={{
                  pathname: `/containers/${container.id}`,
                  query: { name: container.name },
                }}
                key={container.id}
              >
                <li>{container.name}</li>
              </Link>
            ))}
          </ul>
          <CreateNewButton
            tooltipText="Create new container"
            onClick={() => setShowNewContainer(!showNewContainer)}
          />
        </>
      )}
    </div>
  );
}
