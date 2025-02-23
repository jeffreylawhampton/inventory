"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory({ name, color, userId }) {
  userId = parseInt(userId);
  let colorId = await prisma.color.findFirst({
    where: {
      userId,
      hex: color.hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        userId,
        hex: color.hex,
      },
    });
  }
  await prisma.category.create({
    data: {
      name,
      userId,
      colorId: colorId.id,
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

export async function updateCategory({ name, color, id, userId }) {
  id = parseInt(id);
  userId = parseInt(userId);

  let colorId = await prisma.color.findFirst({
    where: {
      userId,
      hex: color.hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        hex: color.hex,
        userId,
      },
    });
  }

  const updated = await prisma.category.update({
    where: {
      id,
      userId,
    },
    data: {
      name,
      colorId: colorId.id,
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

export async function deleteMany(selected) {
  const { user } = await getSession();
  await prisma.category.deleteMany({
    where: {
      id: {
        in: selected,
      },
      user: {
        email: user.email,
      },
    },
  });
  revalidatePath("/categories");
}
