import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(req) {
  const { user } = await getSession();
  const params = new URL(req.url).searchParams;
  const id = parseInt(params.get("id"));
  const type = params.get("type");
  let selected = {};

  if (type === "location") {
    selected = await prisma.location.findUnique({
      where: {
        user: {
          email: user.email,
        },
        id,
      },
      select: {
        name: true,
        id: true,
        favorite: true,
        items: {
          where: {
            containerId: null,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            categories: {
              include: {
                color: true,
              },
            },
            images: true,
            favorite: true,
          },
        },
        containers: {
          where: {
            parentContainerId: null,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            favorite: true,
            color: true,
            location: true,
            locationId: true,
            parentContainerId: true,
          },
        },
      },
    });
  }
  if (type === "item") {
    selected = await prisma.item.findUnique({
      where: {
        user: {
          email: user.email,
        },
        id,
      },
      include: {
        container: {
          select: {
            id: true,
            name: true,
            parentContainer: {
              select: {
                id: true,
                name: true,
                parentContainer: {
                  select: {
                    id: true,
                    name: true,
                    parentContainer: {
                      select: {
                        id: true,
                        name: true,
                        parentContainer: {
                          select: {
                            id: true,
                            name: true,
                            parentContainer: {
                              select: {
                                id: true,
                                name: true,
                                parentContainer: {
                                  select: {
                                    id: true,
                                    name: true,
                                    parentContainer: {
                                      select: {
                                        id: true,
                                        name: true,
                                        parentContainer: {
                                          select: {
                                            id: true,
                                            name: true,
                                            parentContainer: {
                                              select: {
                                                id: true,
                                                name: true,
                                                parentContainer: {
                                                  select: {
                                                    id: true,
                                                    name: true,
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
        categories: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            color: {
              select: {
                hex: true,
              },
            },
          },
        },
        images: true,
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  if (type === "container") {
    selected = await prisma.container.findUnique({
      where: {
        user: {
          email: user.email,
        },
        id,
      },
      select: {
        id: true,
        name: true,
        color: true,
        parentContainer: {
          select: {
            id: true,
            name: true,
            parentContainer: {
              select: {
                id: true,
                name: true,
                parentContainer: {
                  select: {
                    id: true,
                    name: true,
                    parentContainer: {
                      select: {
                        id: true,
                        name: true,
                        parentContainer: {
                          select: {
                            id: true,
                            name: true,
                            parentContainer: {
                              select: {
                                id: true,
                                name: true,
                                parentContainer: {
                                  select: {
                                    id: true,
                                    name: true,
                                    parentContainer: {
                                      select: {
                                        id: true,
                                        name: true,
                                        parentContainer: {
                                          select: {
                                            id: true,
                                            name: true,
                                            parentContainer: {
                                              select: {
                                                id: true,
                                                name: true,
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
        parentContainerId: true,
        location: true,
        locationId: true,
        favorite: true,
        items: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            favorite: true,
            container: {
              select: {
                id: true,
                name: true,
              },
            },
            categories: {
              select: {
                id: true,
                name: true,
                color: {
                  select: {
                    hex: true,
                  },
                },
              },
            },
          },
        },
        containers: {
          select: {
            name: true,
            id: true,
            color: true,
            favorite: true,
            parentContainer: true,
            location: true,
          },
        },
      },
    });
  }
  selected.type = type;
  return Response.json(selected);
}
