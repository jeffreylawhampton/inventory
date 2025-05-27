"use server";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function toggleFavorite({ type, id, add }) {
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

  return updated ? true : false;
}

export async function updateColor({ id, hex, type }) {
  id = parseInt(id);
  const { user } = await getSession();

  let colorId = await prisma.color.findFirst({
    where: {
      user: {
        email: user.email,
      },
      hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        user: {
          email: user.email,
        },
        hex,
      },
    });
  }
  await prisma[type].update({
    where: {
      id,
    },
    data: {
      colorId: colorId.id,
    },
  });
}

export async function getContainerCounts(containerIds) {
  const result = {};

  for (const id of containerIds) {
    let itemCount = 0;
    let containerCount = 0;

    const visited = new Set();
    const stack = [id];

    while (stack.length) {
      const currentId = stack.pop();
      if (!currentId || visited.has(currentId)) continue;
      visited.add(currentId);

      const container = await prisma.container.findUnique({
        where: { id: currentId },
        select: {
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
          containers: {
            select: {
              id: true,
            },
          },
        },
      });

      if (container) {
        itemCount += container._count.items;
        const childContainers = container.containers;
        containerCount += childContainers.length;
        stack.push(...childContainers.map((c) => c.id));
      }
    }

    result[id] = {
      itemCount,
      containerCount,
    };
  }

  return result;
}
