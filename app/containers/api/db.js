"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function createContainer({
  name,
  userId,
  locationId,
  parentContainerId,
}) {
  return await prisma.container.create({
    data: {
      locationId,
      parentContainerId,
      name,
      userId,
    },
  });
}

export async function updateContainer({
  id,
  name,
  locationId,
  parentContainerId,
  containers,
  items,
}) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.container.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
      locationId,
      parentContainerId,
    },
  });
}

export async function deleteContainer({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.container.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  redirect("/containers");
}
