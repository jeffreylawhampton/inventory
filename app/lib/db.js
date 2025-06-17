"use server";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

export async function toggleFavorite({ type, id, add }) {
  const { user } = await getSession();
  const updated = await prisma[type].update({
    where: {
      user: {
        auth0Id: user.sub,
      },
      id,
    },
    data: {
      favorite: add,
    },
  });

  return updated ? true : false;
}

export const addFaves = async ({ type, list }) => {
  const { user } = await getSession();
  await prisma[type].updateMany({
    where: {
      user: {
        auth0Id: user.sub,
      },
      id: { in: list },
    },
    data: {
      favorite: true,
    },
  });
};

export const removeFavorite = async ({ type, id }) => {
  const { user } = await getSession();
  return await prisma[type].update({
    where: {
      user: {
        auth0Id: user.sub,
      },
      id: parseInt(id),
    },
    data: {
      favorite: false,
    },
  });
};

export async function removeCategoryItems({ id, items }) {
  const { user } = await getSession();

  await prisma.category.update({
    where: {
      user: {
        auth0Id: user.sub,
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

export async function updateColor({ id, hex, type }) {
  id = parseInt(id);
  const { user: dbUser } = await getSession();

  const user = await prisma.user.findFirst({
    where: {
      auth0Id: dbUser.sub,
    },
    select: {
      id: true,
    },
  });
  let colorId = await prisma.color.findFirst({
    where: {
      userId: user.id,
      hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        userId: user.id,
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

export async function createContainer({
  name,
  color,
  locationId,
  parentContainerId,
}) {
  locationId = parseInt(locationId);
  parentContainerId = parseInt(parentContainerId);
  const { user: dbuser } = await getSession();

  const user = await prisma.user.findFirst({
    where: {
      auth0Id: dbuser.sub,
    },
  });
  let parentContainer;
  if (parentContainerId) {
    parentContainer = await prisma.container.findFirst({
      where: {
        parentContainerId,
        userId: user.id,
      },
      select: {
        locationId: true,
      },
    });
  }

  let colorId = await prisma.color.findFirst({
    where: {
      userId: user.id,
      hex: color?.hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        userId: user.id,
        hex: color?.hex,
      },
    });
  }

  await prisma.container.create({
    data: {
      parentContainerId,
      locationId: locationId
        ? locationId
        : parentContainer?.locationId
        ? parentContainer.locationId
        : null,
      name,
      userId: user.id,
      colorId: colorId?.id,
    },
  });

  await prisma.color.deleteMany({
    where: {
      userId: user.id,
      Container: { none: {} },
      Category: { none: {} },
    },
  });

  return true;
}

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

  await prisma.color.deleteMany({
    where: {
      userId,
      Container: { none: {} },
      Category: { none: {} },
    },
  });
}

export async function createLocation({ name }) {
  const { user } = await getSession();
  await prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          auth0Id: user.sub,
        },
      },
    },
  });
}

export async function updateLocation({ name, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.location.update({
    where: {
      id,
      user: {
        auth0Id: user.sub,
      },
    },
    data: {
      name,
    },
  });
}

export async function deleteObject({ id, type, navigate }) {
  id = parseInt(id);

  const { user } = await getSession();
  try {
    await prisma[type].delete({
      where: {
        id,
        user: {
          auth0Id: user.sub,
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  } finally {
    if (navigate) redirect(navigate);
  }
}

export async function deleteMany({ selected, type }) {
  const { user } = await getSession();

  try {
    await prisma[type].deleteMany({
      where: {
        id: {
          in: selected,
        },
        user: {
          auth0Id: user.sub,
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  }
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

export async function updateObject({ data, type, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  try {
    await prisma[type].update({
      where: {
        id,
        user: {
          auth0Id: user.sub,
        },
      },
      data,
    });
  } catch (e) {
    throw new Error(e);
  }
}

export async function deleteVarious(obj) {
  const { user } = await getSession();

  try {
    const deletions = Object.entries(obj).map(([key, value]) =>
      prisma[key].deleteMany({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id: {
            in: value,
          },
        },
      })
    );

    await prisma.$transaction(deletions);
  } catch (e) {
    throw new Error(e);
  }
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
  userId,
}) {
  id = parseInt(id);
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);

  const filteredCategories = categories?.filter((category) => category);

  await prisma.item.update({
    where: {
      id,
      userId,
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
            publicId: image?.public_id,
            userId,
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
            publicId: image?.public_id,
            userId,
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

export async function createImages({ item, images }) {
  const itemId = parseInt(item?.id);
  const userId = parseInt(item?.userId);

  await prisma.item.update({
    where: {
      id: itemId,
      userId,
    },
    data: {
      images: {
        create: images?.map((image) => {
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
            publicId: image?.public_id,
            userId,
          };
        }),
      },
    },
  });
}

export async function deleteImages({ userId, imagesToDelete }) {
  const imageIds = imagesToDelete?.map((image) => image.id);
  const publicIds = imagesToDelete?.map((image) => image.publicId);

  try {
    await prisma.image.deleteMany({
      where: {
        id: {
          in: imageIds,
        },
        userId,
      },
    });

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinary.api.delete_resources(publicIds, { invalidate: true });
  } catch (e) {
    throw new Error(e);
  }
}

export const addItems = async ({ type, id, items = [], data }) => {
  const { user } = await getSession();
  id = parseInt(id);

  const connectItems = items.map((item) => parseInt(item.id));
  const categoryConnectItems = items?.map((item) => ({
    id: parseInt(item.id),
  }));

  try {
    if (type === "category") {
      await prisma.category.update({
        where: { id },
        data: {
          items: {
            connect: categoryConnectItems,
          },
        },
      });
    } else {
      await prisma.item.updateMany({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id: {
            in: connectItems,
          },
        },
        data: {
          locationId: type === "location" ? id : data?.locationId,
          containerId: type === "location" ? null : id,
        },
      });
    }
  } catch (e) {
    console.error("Failed to add items:", e);
    throw new Error(e.message);
  }
};

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
