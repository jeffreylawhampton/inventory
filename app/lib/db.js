"use server";
import { revalidatePath, revalidateTag } from "next/cache";
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

export async function revalidate(path) {
  return revalidatePath(path);
}

export async function addFavorite(type, id) {
  id = parseInt(id);
  const { user } = await getSession();
  return prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: true,
    },
  });
}

export async function removeFavorite(type, id) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: false,
    },
  });
  return revalidatePath("/items");
}

export async function toggleFavorite({ type, id, add }) {
  id = parseInt(id);
  const { user } = await getSession();
  const updated = await prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: add,
    },
  });
  console.log(updated);
}

export async function findAndToggleFavorite({ type, id, userId, favorite }) {
  id = parseInt(id);

  await prisma[type].update({
    where: {
      userId,
      id,
    },
    data: {
      favorite,
    },
  });
}
