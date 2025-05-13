"use server";
import { getDescendantIds } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function createLocation({ name }) {
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

export async function updateLocation({ name, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.location.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
    },
  });
}

export async function deleteLocation({ id }) {
  id = parseInt(id);

  const { user } = await getSession();
  await prisma.location.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  return redirect("/locations");
}

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

export async function deleteMany(selected) {
  const { user } = await getSession();
  await prisma.location.deleteMany({
    where: {
      id: {
        in: selected,
      },
      user: {
        email: user.email,
      },
    },
  });
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

export async function deleteVarious(obj) {
  const { user } = await getSession();

  try {
    const deletions = Object.entries(obj).map(([key, value]) =>
      prisma[key].deleteMany({
        where: {
          user: {
            email: user.email,
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
}
