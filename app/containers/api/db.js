"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContainer({
  name,
  userId,
  locationId,
  parentContainerId,
}) {
  const parentLevel = await prisma.container.findFirst({
    where: {
      id: parentContainerId,
    },
    select: {
      level: true,
      locationId: true,
    },
  });

  await prisma.container.create({
    data: {
      parentContainerId,
      locationId: parentContainerId
        ? parentLevel.locationId
        : parseInt(locationId),
      name,
      userId,
      level: parentContainerId ? parentLevel?.level + 1 : 0,
    },
  });
  revalidatePath("/containers");
  return true;
}

export async function updateContainer({
  id,
  name,
  parentContainerId,
  locationId,
}) {
  id = parseInt(id);
  parentContainerId = parseInt(parentContainerId);
  locationId = parseInt(locationId);

  let parentLocation;
  if (parentContainerId) {
    parentLocation = await prisma.container.findFirst({
      where: {
        id: parentContainerId,
      },
      select: {
        locationId: true,
        level: true,
      },
    });
    if (!locationId) locationId = parentLocation.locationId;
  }

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        {
          containerId: id,
        },
        { container: { parentContainerId: id } },
        { container: { parentContainer: { parentContainerId: id } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: id },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainerId: id },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainer: { parentContainerId: id } },
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

  const container = await prisma.container.update({
    where: {
      id,
    },
    data: {
      name,
      locationId,
      parentContainerId,
      level: parentContainerId ? parentLocation?.level + 1 : 0,
    },
  });

  const childContainers = await prisma.container.updateMany({
    where: {
      OR: [
        {
          parentContainer: { id },
        },
        { parentContainer: { parentContainer: { id } } },
        { parentContainer: { parentContainer: { parentContainer: { id } } } },
        {
          parentContainer: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
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
  revalidatePath(`/containers/api/${id}`);
}

export async function moveContainer({
  id,
  name,
  parentContainerId,
  locationId,
}) {
  id = parseInt(id);
  parentContainerId = parseInt(parentContainerId);
  locationId = parseInt(locationId);

  if (parentContainerId) {
    const newLocation = await prisma.container.findFirst({
      where: {
        id: parentContainerId,
      },
      select: {
        locationId,
      },
    });
    locationId = newLocation.locationId;
  }

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        {
          containerId: id,
        },
        { container: { parentContainerId: id } },
        { container: { parentContainer: { parentContainerId: id } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: id },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainerId: id },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainer: { parentContainerId: id } },
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

  const container = await prisma.container.update({
    where: {
      id,
    },
    data: {
      name,
      locationId,
      parentContainerId,
    },
  });

  const childContainers = await prisma.container.updateMany({
    where: {
      OR: [
        {
          parentContainer: { id },
        },
        { parentContainer: { parentContainer: { id } } },
        { parentContainer: { parentContainer: { parentContainer: { id } } } },
        {
          parentContainer: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
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
  revalidatePath(`/containers/api/${id}`);
  revalidatePath("/containers");
}

export async function deleteContainer({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.container.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  redirect("/containers");
}

export async function getNested(id) {
  id = parseInt(id);
  const result = await prisma.$queryRaw`WITH RECURSIVE container_hierarchy AS (
      SELECT id, name, 0 as level -- Starting with level 0 for the root category
      FROM "Container"
      WHERE id = ${id} -- Replace 1 with the id of the category you want to query
      UNION ALL

      SELECT
          container.id,
          container.name,
          container_hierarchy.level + 1 -- Incrementing the level for each nested category
      FROM "Container" container
      JOIN container_hierarchy container_hierarchy
    ON container."containerId" = container_hierarchy."id"
  )
  SELECT * FROM container_hierarchy;`;

  return result;
}
