"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

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

export async function updateCategory({ name, color, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.category.update({
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

export async function deleteCategory({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.category.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  return redirect("/categories");
}
