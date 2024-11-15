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
                  parentContainer: {
                    parentContainer: { parentContainerId: id },
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
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
                },
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
    }),
  ]);
  revalidatePath(`/containers/api/${id}`);
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
  const { user } = await getSession();

  await prisma.$transaction([
    prisma.container.update({
      where: {
        id: containerId,
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
        OR: [
          { parentContainerId: containerId },
          { parentContainer: { parentContainerId: containerId } },
          {
            parentContainer: {
              parentContainer: { parentContainerId: containerId },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainerId: containerId },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainerId: containerId },
                },
              },
            },
          },
        ],
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
        OR: [
          { containerId },
          { container: { parentContainerId: containerId } },
          {
            container: { parentContainer: { parentContainerId: containerId } },
          },
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
                  parentContainer: { parentContainerId: containerId },
                },
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
          {
            container: {
              parentContainer: {
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
          },
          {
            container: {
              parentContainer: {
                parentContainer: {
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
            },
          },
          {
            container: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
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
              },
            },
          },
          {
            container: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainerId: containerId,
                              },
                            },
                          },
                        },
                      },
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
  revalidatePath("/containers");
  revalidatePath("/locations");
}
