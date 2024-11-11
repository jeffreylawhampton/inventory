"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function getCategory({ id }) {
  const { user } = await getSession();
  return await prisma.category.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
  });
}

export async function getCategories() {
  const { user } = await getSession();
  return await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
  });
}

export async function createCategory({ name, color }) {
  const { user } = await getSession();
  return prisma.category.create({
    data: {
      name,
      color,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
}

export async function createNewLocation({ name }) {
  const { user } = await getSession();
  await prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
}

export async function updateCategory({ name, color, id, items }) {
  id = parseInt(id);
  const { user } = await getSession();
  return prisma.category.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
      color,
    },
  });
}

export async function revalidate(path) {
  return revalidatePath(path);
}

export async function addFavorite(type, id) {
  id = parseInt(id);
  const { user } = await getSession();
  return prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: true,
    },
  });
}

export async function removeFavorite(type, id) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: false,
    },
  });
  return revalidatePath("/items");
}

export async function toggleFavorite({ type, id, add }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma[type].update({
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
  revalidatePath("/");
}

export async function findAndToggleFavorite({ type, id, userId, favorite }) {
  id = parseInt(id);

  await prisma[type].update({
    where: {
      userId,
      id,
    },
    data: {
      favorite,
    },
  });
}

// todo: transactions
export async function moveContainerToLocation({ containerId, locationId }) {
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);

  const updated = await prisma.container.update({
    where: {
      id: containerId,
    },
    data: {
      locationId,
      parentContainerId: null,
      containers: {
        updateMany: {
          where: {
            parentContainerId: containerId,
          },
          data: {
            locationId,
          },
        },
      },
    },
  });

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        { containerId },
        { container: { parentContainerId: containerId } },
        { container: { parentContainer: { parentContainerId: containerId } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: containerId },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainerId: containerId },
                },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainerId: containerId },
                  },
                },
              },
            },
          },
        },
      ],
    },
    data: {
      locationId,
    },
  });
  revalidatePath("/locations");
}

export async function moveContainerToContainer({
  containerId,
  newContainerId,
  newContainerLocationId,
}) {
  containerId = parseInt(containerId);
  newContainerId = parseInt(newContainerId);
  newContainerLocationId = parseInt(newContainerLocationId);
  if (containerId === newContainerId) return;
  const updated = await prisma.container.update({
    where: {
      id: containerId,
    },
    data: {
      locationId: newContainerLocationId,
      parentContainerId: newContainerId,
      containers: {
        updateMany: {
          where: {
            parentContainerId: containerId,
          },
          data: {
            locationId: newContainerLocationId,
          },
        },
      },
    },
  });

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        { containerId },
        { container: { parentContainerId: containerId } },
        { container: { parentContainer: { parentContainerId: containerId } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: containerId },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainerId: containerId },
                },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainerId: containerId },
                  },
                },
              },
            },
          },
        },
      ],
    },
    data: {
      locationId: newContainerLocationId,
    },
  });
  revalidatePath("/locations");
}
