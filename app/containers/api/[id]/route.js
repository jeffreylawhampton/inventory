import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;

  id = parseInt(id);

  let container = await prisma.container.findFirst({
    orderBy: {
      name: "asc",
    },
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      color: true,
      parentContainer: {
        include: {
          parentContainer: {
            include: {
              parentContainer: {
                include: {
                  parentContainer: {
                    include: {
                      parentContainer: {
                        include: {
                          parentContainer: {
                            include: {
                              parentContainer: {
                                include: {
                                  parentContainer: {
                                    include: {
                                      parentContainer: {
                                        include: {
                                          parentContainer: {
                                            include: {
                                              parentContainer: {
                                                include: {
                                                  parentContainer: {
                                                    include: {
                                                      parentContainer: {
                                                        select: {
                                                          parentContainer: true,
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
      location: true,
      items: {
        include: {
          location: true,
          images: true,
          categories: {
            include: {
              color: true,
            },
          },
        },
      },
    },
  });

  const containerArray = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
      OR: [
        { parentContainerId: id },
        { parentContainer: { parentContainerId: id } },
        { parentContainer: { parentContainer: { parentContainerId: id } } },
        {
          parentContainer: {
            parentContainer: { parentContainer: { parentContainerId: id } },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainerId: id } },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: { parentContainer: { parentContainerId: id } },
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
                    parentContainer: { parentContainerId: id },
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
                      parentContainer: { parentContainerId: id },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          items: {
            where: {
              user: {
                email: user.email,
              },
            },
          },
          containers: {
            where: {
              user: {
                email: user.email,
              },
            },
          },
        },
      },
      location: true,
      parentContainer: true,
      color: true,
      items: {
        select: {
          favorite: true,
          categories: {
            include: {
              color: true,
            },
          },
          id: true,
          name: true,
          location: true,
          container: true,
          containerId: true,
          locationId: true,
          images: true,
          userId: true,
        },
      },
    },
  });

  container = { ...container, containerArray };

  return Response.json({ container });
}
