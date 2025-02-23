"use client";
import useSWR from "swr";
import { useUserColors } from "../hooks/useUserColors";
import ProfileClient from "../components/profile-client";
import { Loading } from "@/app/components";
import { fetcher } from "../lib/fetcher";
import CreateColor from "./CreateColor";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColorPicker, ColorSwatch } from "@mantine/core";
import { deleteColor, updateColor } from "./api/db";

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR("/user/api", fetcher);
  const { user, colors } = useUserColors();

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div>
      <h1 className="text-3xl font-bold">Colors</h1>
      {colors?.map((color) => {
        return (
          <div key={color} className="flex gap-2">
            <div
              className="w-8 h-8 rounded-md"
              style={{ backgroundColor: color }}
            />{" "}
            {color.toUpperCase()}
            <IconPencil />
            <IconTrash />
          </div>
        );
      })}

      <CreateColor userId={user?.id} data={data} mutate={mutate} />
      <ProfileClient />
      <a href="/api/auth/logout">Log out</a>
    </div>
  );
}
