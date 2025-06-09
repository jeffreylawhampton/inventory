"use server";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

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
        auth0Id: user.sub,
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
