"use server";
import { getDescendantIds } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function createContainer({
  name,
  userId,
  color,
  locationId,
  parentContainerId,
}) {
  locationId = parseInt(locationId);
  parentContainerId = parseInt(parentContainerId);

  let parentContainer;
  if (parentContainerId) {
    parentContainer = await prisma.container.findFirst({
      where: {
        id: parentContainerId,
        userId,
      },
      select: {
        locationId: true,
      },
    });
  }

  let colorId = await prisma.color.findFirst({
    where: {
      userId,
      hex: color?.hex,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        userId,
        hex: color?.hex,
      },
    });
  }

  await prisma.container.create({
    data: {
      parentContainerId,
      locationId: parentContainerId
        ? parentContainer.locationId
        : parseInt(locationId),
      name,
      userId,
      colorId: colorId?.id,
    },
  });
  return true;
}

export async function updateContainerColor({ id, userId, color }) {
  id = parseInt(id);
  userId = parseInt(userId);

  let colorId = await prisma.color.findFirst({
    where: {
      userId,
      hex: color,
    },
  });

  if (!colorId) {
    colorId = await prisma.color.create({
      data: {
        userId,
        hex: color,
      },
    });
  }
  await prisma.container.update({
    where: {
      id,
    },
    data: {
      colorId: colorId.id,
    },
  });
}

export async function updateContainer({
  id,
  name,
  parentContainerId,
  locationId,
  color,
  userId,
}) {
  id = parseInt(id);
  parentContainerId = parseInt(parentContainerId);
  userId = parseInt(userId);
  locationId = parseInt(locationId);
  const { user } = await getSession();

  try {
    const allContainers = await prisma.container.findMany({
      where: {
        user: {
          auth0Id: user.sub,
        },
      },
      select: {
        id: true,
        parentContainerId: true,
        items: {
          select: {
            id: true,
          },
        },
      },
    });
    let parentLocation;

    let containerItems = [];

    const originalContainer = allContainers.find((con) => con.id === id);

    if (Array.isArray(originalContainer.items)) {
      originalContainer.items.forEach((item) => containerItems.push(item.id));
    }

    const { containers, items } = getDescendantIds(
      allContainers,
      id,
      containerItems
    );

    if (parentContainerId) {
      parentLocation = await prisma.container.findFirst({
        where: {
          id: parentContainerId,
        },
        select: {
          locationId: true,
        },
      });
      if (!locationId) locationId = parentLocation.locationId;
    }

    let colorId = await prisma.color.findFirst({
      where: {
        userId,
        hex: color?.hex,
      },
    });

    if (!colorId) {
      colorId = await prisma.color.create({
        data: {
          hex: color?.hex,
          userId,
        },
      });
    }

    await prisma.$transaction([
      prisma.item.updateMany({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id: {
            in: items,
          },
        },
        data: {
          locationId,
        },
      }),
      prisma.container.update({
        where: {
          id,
        },
        data: {
          name,
          colorId: colorId.id,
          locationId,
          parentContainerId,
        },
      }),
      prisma.container.updateMany({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id: {
            in: containers,
          },
        },
        data: {
          locationId,
        },
      }),
    ]);
  } catch (e) {
    throw new Error("Failed to update container");
  }
}

export async function moveItem({ itemId, containerId, containerLocationId }) {
  containerId = parseInt(containerId);
  containerLocationId = parseInt(containerLocationId);
  itemId = parseInt(itemId);

  const updated = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      containerId,
      locationId: containerLocationId,
    },
  });
}

export async function moveContainerToContainer({
  containerId,
  newContainerId,
  newContainerLocationId,
}) {
  containerId = parseInt(containerId);
  newContainerId = parseInt(newContainerId);
  newContainerLocationId = parseInt(newContainerLocationId);
  const { user } = await getSession();

  const allContainers = await prisma.container.findMany({
    where: {
      user: {
        auth0Id: user.sub,
      },
    },
    select: {
      id: true,
      parentContainerId: true,
      items: {
        select: {
          id: true,
        },
      },
    },
  });

  const originalContainer = allContainers.find((c) => c.id === containerId);
  let containerItems = [];
  if (Array.isArray(originalContainer.items)) {
    originalContainer.items.forEach((i) => containerItems.push(i.id));
  }
  const { containers, items } = getDescendantIds(
    allContainers,
    containerId,
    containerItems
  );

  await prisma.$transaction([
    prisma.container.update({
      where: {
        user: {
          auth0Id: user.sub,
        },
        id: containerId,
      },
      data: {
        parentContainerId: newContainerId,
        locationId: newContainerLocationId,
      },
    }),
    prisma.container.updateMany({
      where: {
        user: {
          auth0Id: user.sub,
        },
        id: {
          in: containers,
        },
      },
      data: {
        locationId: newContainerLocationId,
      },
    }),
    prisma.item.updateMany({
      where: {
        user: {
          auth0Id: user.sub,
        },
        id: {
          in: items,
        },
      },
      data: {
        locationId: newContainerLocationId,
      },
    }),
  ]);
}

export async function removeFromContainer({ id, isContainer }) {
  id = parseInt(id);
  const { user } = await getSession();
  if (isContainer) {
    await prisma.container.update({
      where: {
        id,
        user: {
          auth0Id: user.sub,
        },
      },
      data: {
        parentContainer: {
          disconnect: true,
        },
      },
    });
  } else {
    await prisma.item.update({
      where: {
        id,
        user: {
          auth0Id: user.sub,
        },
      },
      data: {
        container: {
          disconnect: true,
        },
      },
    });
  }
}
