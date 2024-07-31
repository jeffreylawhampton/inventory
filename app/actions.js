"use server";
import prisma from "./lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";

export async function addLocationContainer({ locationId, containerId }) {
  const id = parseInt(containerId);
  locationId = parseInt(locationId);
  const { user } = await getSession();
  try {
    await prisma.container.update({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
      data: {
        locationId,
      },
    });
    revalidatePath(`/locations/${id}`);
  } catch (e) {
    throw new Error(e);
  }
  revalidatePath(`/locations/${id}`);
}

export async function removeLocationContainer({ containerId }) {
  const id = parseInt(containerId);
  const { user } = await getSession();
  try {
    await prisma.container.update({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
      data: {
        locationId: null,
      },
    });
    revalidatePath(`/locations/${id}`);
  } catch (e) {
    throw new Error(e);
  }
  revalidatePath(`/locations/${id}`);
}

export async function deleteLocation(id) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.location.delete({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
  });
  revalidatePath("/locations");
  redirect("/locations");
}

export async function createUser(input) {
  await prisma.user.create({
    data: {
      ...input,
    },
  });
  try {
    await prisma.user.create({
      data: {
        input,
      },
    });
    return "success";
  } catch (e) {
    throw e;
  }
}

export async function upsertUser({ id, name, email }) {
  id = id ? parseInt(id) : 0;
  try {
    return await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        email,
      },
      create: {
        name,
        email,
      },
    });
  } catch (e) {
    throw e;
  }
}

export const updateItemCategories = async ({ itemId, categories }) => {
  const { user } = await getSession();
  return await prisma.item.update({
    where: {
      id: itemId,
      user: {
        email: user.email,
      },
    },
    data: {
      categories: {
        set: [],
        connect: categories?.map((category) => ({ id: category })),
      },
    },
  });
};

export const addItemCategory = async ({ itemId, userId, categoryId }) => {
  try {
    await prisma.item.update({
      where: {
        id: itemId,
        userId,
      },
      data: {
        categories: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  }
  return revalidatePath(`/items/${itemId}`);
};

export const removeItemCategory = async ({ itemId, userId, categoryId }) => {
  try {
    await prisma.item.update({
      where: {
        id: itemId,
        userId,
      },
      data: {
        categories: {
          disconnect: {
            id: categoryId,
          },
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  }
  return revalidatePath(`/items/${itemId}`);
};

export const removeAllCategories = async ({ itemId }) => {
  const { user } = await getSession();
  await prisma.item.update({
    where: {
      id: itemId,
      user: {
        email: user.email,
      },
    },
    data: {
      categories: {
        set: [],
        connect: categories?.map((category) => ({ id: category })),
      },
    },
  });
};
