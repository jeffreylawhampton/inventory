"use client";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import ProfileClient from "../components/profile-client";
import CreateColor from "./CreateColor";
import { ColorSwatch } from "@mantine/core";
import { useUserColors } from "../hooks/useUserColors";
import { deleteColor } from "./api/db";
import Loading from "../components/Loading";

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR("/user/api", fetcher);
  const { user } = useUserColors();

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div>
      <div className="flex gap-1">
        {data?.colors?.map((color) => (
          <ColorSwatch
            key={color.hex}
            color={color.hex}
            onClick={() => deleteColor({ id: color.id })}
          />
        ))}
      </div>
      <CreateColor userId={user?.id} data={data} mutate={mutate} />
      <ProfileClient />
    </div>
  );
}
