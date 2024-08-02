"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function createItem({
  name,
  description,
  value,
  quantity,
  serialNumber,
  purchasedAt,
  locationId,
  containerId,
  images,
  userId,
  categories,
}) {
  return prisma.item.create({
    data: {
      name,
      description,
      value,
      quantity,
      serialNumber,
      purchasedAt,
      locationId,
      containerId,
      userId,
      images: {
        create: images?.map((image) => {
          return {
            id: image?.id,
            url: image?.url,
            caption: image?.filename,
            originalFile: {
              create: {
                name: image?.originalFile?.name,
                id: image?.originalFile?.id,
                size: image?.originalFile?.size,
                type: image?.originalFile?.type,
              },
            },
          };
        }),
      },
      categories: {
        connect: categories?.map((category) => {
          return { id: parseInt(category) };
        }),
      },
    },
  });
}

export async function updateItem({
  id,
  name,
  locationId,
  containerId,
  value,
  quantity,
  description,
  purchasedAt,
  serialNumber,
  images,
  categories,
}) {
  id = parseInt(id);
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);
  const filteredCategories = categories?.filter((category) => category);
  const { user } = await getSession();

  return await prisma.item.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
      locationId,
      containerId,
      description,
      quantity,
      value,
      purchasedAt,
      serialNumber,
      images: {
        create: images?.map((image) => {
          return {
            id: image?.id,
            url: image?.url,
            caption: image?.filename,
            originalFile: {
              create: {
                name: image?.originalFile?.name,
                id: image?.originalFile?.id,
                size: image?.originalFile?.size,
                type: image?.originalFile?.type,
              },
            },
          };
        }),
      },
      categories: {
        set: [],
        connect: filteredCategories?.map((category) => {
          return { id: parseInt(category) };
        }),
      },
    },
  });
}

export async function deleteItem({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  try {
    await prisma.item.delete({
      where: {
        id,
        user: {
          email: user?.email,
        },
      },
    });
  } catch (e) {
    throw e;
  }
  redirect("/items");
}
