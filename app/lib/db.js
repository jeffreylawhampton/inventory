"use server";
import { revalidateTag } from "next/cache";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function getCategory({ id }) {
  const { user } = await getSession();
  return await prisma.category.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
  });
}

export async function getCategories() {
  const { user } = await getSession();
  return await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
  });
}

export async function createCategory({ name, color }) {
  const { user } = await getSession();
  return prisma.category.create({
    data: {
      name,
      color,
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

export async function updateCategory({ name, color, id, items }) {
  id = parseInt(id);
  const { user } = await getSession();
  return prisma.category.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
      color,
    },
  });
}

export async function revalidate(tag) {
  revalidateTag("locations");
}
