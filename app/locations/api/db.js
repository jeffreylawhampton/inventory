"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function getLocation({ id }) {
  const { user } = await getSession();
  id = parseInt(id);
  return await prisma.location.findUnique({
    where: {
      id,
    },
    include: {
      locations: true,
      parentLocation: true,
    },
  });
}

export async function getLocations() {
  const { user } = await getSession();
  return await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    include: {
      locations: true,
      parentLocation: true,
    },
  });
}

export async function createLocation({ name }) {
  const { user } = await getSession();
  return prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
}

export async function createNewLocation({ name }) {
  const { user } = await getSession();
  await prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
}

export async function updateLocation({ name, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.location.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
    },
  });
}

export async function deleteLocation({ id }) {
  id = parseInt(id);

  const { user } = await getSession();
  await prisma.location.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  return redirect("/locations");
}
