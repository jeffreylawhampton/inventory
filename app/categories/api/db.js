"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

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
}

export async function updateCategory({ name, color, id }) {
  id = parseInt(id);

  const { user } = await getSession();

  let colorId = await prisma.color.findFirst({
    where: {
      userId: user.id,
      hex: color.hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        hex: color.hex,
        userId: user.id,
      },
    });
  }

  const updated = await prisma.category.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      name,
      colorId: colorId.id,
    },
  });
}

export async function removeItems({ id, items }) {
  const { user } = await getSession();

  await prisma.category.update({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(id),
    },
    data: {
      items: {
        disconnect: items?.map((item) => {
          return { id: parseInt(item) };
        }),
      },
    },
  });
}
