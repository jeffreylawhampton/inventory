import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const userId = dbUser.id;

  const locations = await prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      userId: dbUser.id,
    },
    include: {
      _count: {
        select: {
          items: {
            where: {
              userId: dbUser.id,
            },
          },
          containers: {
            where: {
              userId: dbUser.id,
            },
          },
        },
      },
      items: {
        where: {
          containerId: null,
        },
        include: {
          images: true,
          categories: {
            include: {
              color: true,
            },
          },
        },
      },
      containers: {
        where: {
          parentContainerId: null,
          userId,
        },
        include: {
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
          color: true,
          items: {
            include: {
              categories: {
                include: {
                  color: true,
                },
              },
            },
          },
          containers: {
            where: {
              userId,
            },
            include: {
              color: true,
              items: {
                include: {
                  categories: {
                    include: {
                      color: true,
                    },
                  },
                },
              },
              containers: {
                where: {
                  userId,
                },
                include: {
                  color: true,
                  items: {
                    include: {
                      categories: {
                        include: {
                          color: true,
                        },
                      },
                    },
                  },
                  containers: {
                    include: {
                      color: true,
                      items: {
                        include: {
                          images: true,
                          categories: {
                            include: {
                              color: true,
                            },
                          },
                        },
                      },
                      containers: {
                        include: {
                          color: true,
                          items: {
                            include: {
                              images: true,
                              categories: {
                                include: {
                                  color: true,
                                },
                              },
                            },
                          },
                          containers: {
                            include: {
                              color: true,
                              items: {
                                include: {
                                  images: true,
                                  categories: {
                                    include: {
                                      color: true,
                                    },
                                  },
                                },
                              },
                              containers: {
                                include: {
                                  color: true,
                                  items: {
                                    include: {
                                      images: true,
                                      categories: {
                                        include: {
                                          color: true,
                                        },
                                      },
                                    },
                                  },
                                  containers: {
                                    include: {
                                      color: true,
                                    },
                                  },
                                  items: {
                                    include: {
                                      images: true,
                                      categories: {
                                        include: {
                                          color: true,
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
  return Response.json({ locations });
}
