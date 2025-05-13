import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;

  const id = parseInt(params.get("id"));
  const type = params.get("type");
  let data;

  if (type === "container")
    data = await prisma.container.findUnique({
      where: {
        user: {
          email: user.email,
        },
        id,
      },
      select: {
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
    });

  if (type === "item")
    data = await prisma.item.findUnique({
      where: {
        user: {
          email: user.email,
        },
        id,
      },
      select: {
        name: true,
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
    });

  return Response.json(data);
}
