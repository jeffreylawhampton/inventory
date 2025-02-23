"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
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
  return revalidatePath("/locations");
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
  revalidatePath("/locations");
  revalidatePath("/");
}

export async function moveContainerToLocation({ containerId, locationId }) {
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);

  await prisma.$transaction([
    prisma.container.update({
      where: {
        id: containerId,
      },
      data: {
        locationId,
        parentContainerId: null,
      },
    }),
    prisma.container.updateMany({
      where: {
        OR: [
          {
            parentContainer: {
              id: containerId,
            },
          },
          { parentContainer: { parentContainer: { id: containerId } } },
          {
            parentContainer: {
              parentContainer: { parentContainer: { id: containerId } },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainer: { id: containerId } },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id: containerId } },
                },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainer: { id: containerId } },
                  },
                },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: { parentContainer: { id: containerId } },
                    },
                  },
                },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: { id: containerId },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: { id: containerId },
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
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: { id: containerId },
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
          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainer: { id: containerId },
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

          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainer: {
                                  parentContainer: { id: containerId },
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
          },

          {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainer: {
                                  parentContainer: {
                                    parentContainer: { id: containerId },
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
            },
          },
        ],
      },
      data: {
        locationId,
      },
    }),
    prisma.item.updateMany({
      where: {
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

  revalidatePath("/locations");
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
          {
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
          {
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
          {
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
          {
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
          {
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
          {
            parentContainer: {
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
          {
            parentContainer: {
              parentContainer: {
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
  revalidatePath("/locations");
}

export async function moveItemNested({ itemId, containerId }) {
  itemId = parseInt(itemId);
  containerId = parseInt(containerId);

  const { user } = await getSession();
  return await prisma.item.update({
    where: {
      user: {
        email: user.email,
      },
      id: itemId,
    },
    data: {
      containerId,
    },
  });
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
  revalidatePath("/locations");
}
