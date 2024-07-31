"use client";
import { Button, CircularProgress, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewContainer from "./NewContainer";

const fetchAllContainers = async () => {
  try {
    const res = await fetch("/containers/api");
    const data = await res.json();
    return data?.containers;
  } catch (e) {
    throw new Error(e);
  }
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["containers"],
    queryFn: fetchAllContainers,
  });

  if (isPending) return <CircularProgress />;
  if (error) return "Something went wrong";

  return (
    <div>
      <ul>
        {data?.map((container) => (
          <Link
            href={`/containers/${container.id}`}
            key={container.id}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["container"] })
            }
          >
            <li>{container.name}</li>
          </Link>
        ))}
      </ul>
      <NewContainer
        container={data}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
      <Button onPress={onOpen}>Create new container</Button>
    </div>
  );
}
