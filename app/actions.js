"use server";
import prisma from "./lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createCategory({ name, userId, color }) {
  try {
    await prisma.category.create({
      data: {
        name,
        userId,
        color,
      },
    });
    return "success";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return "You already have that doofus";
      }
    }
    throw e;
  }
}

export async function getCategories(userId) {
  return await prisma.category.findMany({
    where: { userId },
    include: {
      items: true,
    },
  });
}

export async function getCategory(id) {
  id = parseInt(id);
  return await prisma.category.findFirst({
    where: { id },
  });
}

export async function upsertCategory({ id, name, userId, color }) {
  id = id ? parseInt(id) : 0;
  try {
    return await prisma.category.upsert({
      where: {
        id,
      },
      update: {
        name,
        color,
      },
      create: {
        name,
        userId,
        color,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function deleteCategory(id, user) {
  const { userId } = user;
  try {
    await prisma.category.delete({
      where: { id, userId },
    });
    redirect("/categories");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return "You already have that doofus";
      }
    }
    throw e;
  }
}

export async function upsertItem({
  id,
  name,
  userId,
  description,
  value,
  purchasedAt,
  images,
  categories,
  serialNumber,
  quantity,
  locationId,
}) {
  id = id ? parseInt(id) : 0;
  locationId = locationId ? parseInt(locationId) : null;
  try {
    return await prisma.item.upsert({
      where: {
        id,
      },
      update: {
        name,
        description,
        value,
        purchasedAt,
        locationId,
        serialNumber,
        quantity,

        // categories: {
        //   connectOrCreate: categories.map((category) => {
        //     return {
        //       where: { id: category.id },
        //       create: { name: category.name, userId },
        //     };
        //   }),
        // },
      },
      create: {
        name,
        description,
        value,
        purchasedAt,
        locationId,
        serialNumber,
        userId,
        quantity,
        images: {
          create: images?.map((image) => {
            return {
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
      },
    });
  } catch (e) {
    throw e;
  }
}

export const createItem = async ({
  name,
  userId,
  description,
  images,
  categories,
}) => {
  try {
    return await prisma.item.create({
      data: {
        name,
        userId,
        description,
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
            return { id: category.id };
          }),
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return "You already have that doofus";
      }
    }
    throw e;
  }
};

export const updateItem = async ({
  id,
  name,
  description,
  value,
  images,
  categories,
}) => {
  const updated = await prisma.item.update({
    data: {
      name,
      description,
      value,
      categories: {
        connect: categories?.map((category) => ({
          id: category.id,
        })),
      },
    },
    where: { id },
  });
  return redirect(`/items/${updated.id}`);
};

export async function getItems(userId) {
  return await prisma.item.findMany({
    where: { userId },
  });
}

export async function getItem({ id, userId }) {
  id = parseInt(id);
  return await prisma.item.findFirst({
    where: { id, userId },
    include: {
      images: true,
      categories: true,
    },
  });
}

export async function deleteItem(id, user) {
  const { userId } = user;
  try {
    await prisma.item.delete({
      where: { id, userId },
    });
    return redirect("/items");
  } catch (e) {
    throw e;
  }
}

export async function upsertLocation({ id, name, userId }) {
  id = id ? parseInt(id) : 0;

  try {
    return await prisma.location.upsert({
      where: {
        id,
      },
      update: {
        name,
      },
      create: {
        name,
        userId,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function createLocation({ name, userId }) {
  try {
    await prisma.location.create({
      data: {
        name,
        userId,
      },
    });
    return "success";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return "You already have that doofus";
      }
    }
    throw e;
  }
}

export async function getLocations(userId) {
  return await prisma.location.findMany({
    where: { userId },
    include: {
      items: true,
    },
  });
}

export async function getLocation({ id, userId }) {
  id = parseInt(id);
  return await prisma.location.findFirst({
    where: { id, userId },
    select: {
      parentLocationId: true,
      childLocations: true,
      items: true,
    },
  });
}

export async function deleteLocation(id, user) {
  const { userId } = user;
  try {
    await prisma.location.delete({
      where: { id, userId },
    });
    return redirect("/locations");
  } catch (e) {
    throw e;
  }
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
export async function getUser({ email }) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserData(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      categories: true,
      locations: true,
    },
  });
}
