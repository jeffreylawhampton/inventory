"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
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
  newImages,
  userId,
  categories,
}) {
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);
  const newItem = await prisma.item.create({
    data: {
      name,
      description,
      value,
      quantity,
      serialNumber,
      purchasedAt,
      locationId,
      userId,
      containerId,
      images: {
        create: newImages?.map((image) => {
          return {
            secureUrl: image?.secure_url,
            url: image?.secureUrl,
            caption: image?.filename,
            width: image?.width,
            height: image?.height,
            thumbnailUrl: image?.thumbnail_url,
            alt: image?.display_name,
            format: image?.format,
            featured: image?.metadata?.featured === "true",
            assetId: image?.asset_id,
          };
        }),
      },
      categories: {
        connect: categories?.map((category) => {
          return { id: parseInt(category.id) };
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
  newImages,
  favorite,
}) {
  id = parseInt(id);
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);
  const filteredCategories = categories?.filter((category) => category);
  const { user } = await getSession();

  await prisma.item.update({
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
      favorite,
      images: {
        create: newImages?.map((image) => {
          return {
            secureUrl: image?.secure_url,
            url: image?.secure_url,
            caption: image?.filename,
            width: image?.width,
            height: image?.height,
            thumbnailUrl: image?.thumbnail_url,
            alt: image?.display_name,
            format: image?.format,
            featured: image?.metadata?.featured === "true",
            assetId: image?.asset_id,
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
  return revalidatePath("/items");
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
    redirect("/items");
  } catch (e) {
    throw e;
  }
}
