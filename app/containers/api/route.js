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

  const containers = await prisma.container.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        include: {
          items: true,
          containers: {
            include: {
              containers: {
                include: {
                  containers: {
                    include: {
                      containers: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      color: true,
      parentContainer: {
        include: {
          parentContainer: true,
        },
      },
      items: {
        where: {
          userId,
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
          userId,
        },
        include: {
          items: {
            include: {
              categories: {
                include: {
                  color: true,
                },
              },
            },
          },
          color: true,
          containers: {
            where: {
              userId,
            },
            include: {
              items: {
                where: {
                  userId,
                },
                include: {
                  categories: {
                    include: {
                      color: true,
                    },
                  },
                },
              },
              color: true,
              containers: {
                where: {
                  userId,
                },
                include: {
                  items: {
                    include: {
                      categories: {
                        include: {
                          color: true,
                        },
                      },
                    },
                  },
                  color: true,
                  containers: {
                    where: {
                      userId,
                    },
                    include: {
                      items: {
                        include: {
                          categories: {
                            include: {
                              color: true,
                            },
                          },
                        },
                      },
                      color: true,
                      containers: {
                        where: {
                          userId,
                        },
                        include: {
                          items: {
                            include: {
                              categories: {
                                include: {
                                  color: true,
                                },
                              },
                            },
                          },
                          color: true,
                          containers: {
                            where: {
                              userId,
                            },
                            include: {
                              items: {
                                include: {
                                  categories: {
                                    include: {
                                      color: true,
                                    },
                                  },
                                },
                              },
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
      location: true,
    },
  });
  return Response.json({ containers });
}
