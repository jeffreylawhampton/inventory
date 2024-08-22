"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
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

export async function addItemCategory({ categoryId, items }) {
  const { user } = await getSession();
  await prisma.category.update({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(categoryId),
    },
    data: {
      items: {
        connect: items?.map((item) => {
          return { id: parseInt(item.id) };
        }),
      },
    },
  });
  revalidatePath(`/categories/${categoryId}`);
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
  await prisma.category.update({
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
  return revalidatePath("/categories");
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
  redirect("/categories");
}
