"use client";
import { Button, CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import NewContainer from "./NewContainer";
import useSWR from "swr";
import { useState } from "react";

const fetcher = async () => {
  const res = await fetch("/containers/api");
  const data = await res.json();
  return data.containers;
};

export default function Page() {
  const { data, error, isLoading } = useSWR("containers", fetcher);
  const [showNewContainer, setShowNewContainer] = useState(false);

  if (isLoading) return <CircularProgress />;
  if (error) return "Something went wrong";

  let containerList;
  if (data?.length) {
    containerList = data;
  }

  return (
    <div>
      {showNewContainer ? (
        <NewContainer
          setShowNewContainer={setShowNewContainer}
          containerList={containerList}
        />
      ) : (
        <>
          <ul>
            {containerList?.map((container) => (
              <Link href={`/containers/${container.id}`} key={container.id}>
                <li>{container.name}</li>
              </Link>
            ))}
          </ul>{" "}
          <Button onPress={() => setShowNewContainer(true)}>
            Create new container
          </Button>
        </>
      )}
    </div>
  );
}
