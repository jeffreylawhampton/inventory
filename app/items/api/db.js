"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function createItem({
  name,
  description,
  userId,
  value,
  quantity,
  serialNumber,
  purchasedAt,
  locationId,
  containerId,
  images,
  categories,
}) {
  return prisma.item.create({
    data: {
      name,
      userId,
      description,
      value,
      quantity,
      serialNumber,
      purchasedAt,
      locationId,
      containerId,
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
  if (!containerId) {
    containerId = null;
  } else if (typeof containerId === "string") {
    containerId = parseInt(containerId);
  }

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
        connect: categories?.map((category) => {
          return { id: parseInt(category) };
        }),
      },
    },
  });
}

export async function deleteItem({ id }) {
  id = parseInt(id);

  const { user } = await getSession();
  await prisma.item.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  return redirect("/items");
}
