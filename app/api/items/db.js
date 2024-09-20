"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";

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

export async function addItems({ type, id, items }) {
  const { user } = await getSession();
  id = parseInt(id);
  let locationId;

  if (type === "container") {
    const parentLocation = await prisma.container.findUnique({
      where: {
        id,
      },
      select: {
        locationId: true,
      },
    });
    locationId = parentLocation.locationId;
  }

  let shouldDisconnect;

  const query = prisma[type].update;
  await query({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(id),
    },
    data: {
      items: {
        connect: items?.map((item) => {
          return { id: parseInt(item.id) };
        }),
        updateMany: {
          where: {
            containerId: id,
          },
          data: {
            locationId,
          },
        },
      },
    },
  });
  revalidatePath(
    `/${type === "category" ? "categories" : type.concat("s")}/${id}`
  );
}

export async function removeItems({ type, id, items }) {
  const { user } = await getSession();
  const query = prisma[type].update;
  await query({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(id),
    },
    data: {
      items: {
        disconnect: items?.map((item) => {
          return { id: parseInt(item.id) };
        }),
      },
    },
  });
  revalidatePath(
    `/${type === "category" ? "categories" : type.concat("s")}/${id}`
  );
}

export async function addLocationItems({ items, locationId }) {
  const { user } = await getSession();
  locationId = parseInt(locationId);
  const idArray = items.map((item) => {
    return { id: parseInt(item.id) };
  });
  const itemsToUpdate = await prisma.item.updateMany({
    where: {
      user: {
        email: user.email,
      },
      OR: idArray,
    },
    data: {
      locationId,
      containerId: null,
    },
  });
}
