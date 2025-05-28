"use server";
import { getDescendantIds } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function removeItemFromContainer({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.item.update({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    data: {
      container: {
        disconnect: true,
      },
    },
  });
}

export async function removeFromContainer({ id, isContainer }) {
  id = parseInt(id);
  const { user } = await getSession();
  if (isContainer) {
    await prisma.container.update({
      where: {
        id,
        user: {
          email: user.email,
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
          email: user.email,
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

export async function moveItem({
  itemId,
  destinationId,
  destinationType,
  destinationLocationId,
}) {
  destinationId = parseInt(destinationId);
  destinationLocationId = parseInt(destinationLocationId);
  itemId = parseInt(itemId);

  const data =
    destinationType === "location"
      ? {
          locationId: destinationId,
          containerId: null,
        }
      : { containerId: destinationId, locationId: destinationLocationId };

  const updated = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: data,
  });
}

export async function moveContainerToLocation({ containerId, locationId }) {
  const { user } = await getSession();
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);

  const allUserContainers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
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

  let containerItemIds = [];
  const originalContainer = allUserContainers?.find(
    (con) => con.id === containerId
  );
  if (Array.isArray(originalContainer.items)) {
    originalContainer.items.forEach((item) => containerItemIds.push(item.id));
  }

  const { containers, items } = getDescendantIds(
    allUserContainers,
    containerId,
    containerItemIds
  );

  await prisma.$transaction([
    prisma.container.update({
      where: {
        id: containerId,
        user: {
          email: user.email,
        },
      },
      data: {
        locationId,
        parentContainerId: null,
      },
    }),

    prisma.container.updateMany({
      where: {
        user: {
          email: user.email,
        },
        id: {
          in: containers,
        },
      },
      data: {
        locationId,
      },
    }),

    prisma.item.updateMany({
      where: {
        user: {
          email: user.email,
        },
        id: {
          in: items,
        },
      },
      data: {
        locationId,
      },
    }),
  ]);
}

export async function moveContainerToContainer({
  containerId,
  newContainerId,
  newContainerLocationId,
}) {
  const { user } = await getSession();
  containerId = parseInt(containerId);
  newContainerId = parseInt(newContainerId);
  newContainerLocationId = parseInt(newContainerLocationId);
  if (containerId === newContainerId) return;

  const allUserContainers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
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
  let containerItemIds = [];
  const originalContainer = allUserContainers?.find(
    (con) => con.id === containerId
  );
  if (Array.isArray(originalContainer.items)) {
    originalContainer.items.forEach((item) => containerItemIds.push(item.id));
  }

  const { containers, items } = getDescendantIds(
    allUserContainers,
    containerId,
    containerItemIds
  );

  await prisma.$transaction([
    prisma.container.update({
      where: {
        id: containerId,
        user: {
          email: user.email,
        },
      },
      data: {
        locationId: newContainerLocationId,
        parentContainerId: newContainerId,
      },
    }),

    prisma.container.updateMany({
      where: {
        user: {
          email: user.email,
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
          email: user.email,
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

export async function removeMany({ id, items, containers }) {
  const { user } = await getSession();
  await prisma.location.update({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(id),
    },
    data: {
      items: {
        disconnect: items?.map((item) => {
          return { id: parseInt(item) };
        }),
      },
      containers: {
        disconnect: containers?.map((container) => {
          return { id: parseInt(container) };
        }),
      },
    },
  });
  id = parseInt(id);
  const updated = await prisma.location.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      containers: true,
    },
  });
}
