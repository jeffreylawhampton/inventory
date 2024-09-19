"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
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
  let parentLevel;
  if (parentContainerId)
    parentLevel = await prisma.container.findFirst({
      where: {
        id: parentContainerId,
      },
      select: {
        level: true,
        locationId: true,
      },
    });

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
        ? parentLevel.locationId
        : parseInt(locationId),
      name,
      userId,
      colorId: colorId?.id,
      level: parentContainerId ? parentLevel?.level + 1 : 0,
    },
  });
  revalidatePath("/containers");
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
  revalidatePath("/containers");
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

  let parentLocation;

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

  const container = await prisma.container.update({
    where: {
      id,
    },
    data: {
      name,
      colorId: colorId.id,
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
  revalidatePath("/containers");
}

export async function moveContainerToContainer({
  containerId,
  newContainerId,
  newContainerLocationId,
}) {
  containerId = parseInt(containerId);
  newContainerId = parseInt(newContainerId);
  newContainerLocationId = parseInt(newContainerLocationId);

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
