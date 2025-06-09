"use server";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function addItemCategory({ categoryId, items }) {
  const { user } = await getSession();
  await prisma.category.update({
    where: {
      user: {
        auth0Id: user.sub,
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

  const query = prisma[type].update;
  await query({
    where: {
      user: {
        auth0Id: user.sub,
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
}

export async function removeItems({ type, id, items }) {
  const { user } = await getSession();
  const query = prisma[type].update;
  await query({
    where: {
      user: {
        auth0Id: user.sub,
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
        auth0Id: user.sub,
      },
      OR: idArray,
    },
    data: {
      locationId,
      containerId: null,
    },
  });
}
