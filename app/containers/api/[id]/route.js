import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  // const take = parseInt(params.get("take"));

  id = parseInt(id);
  const container = await prisma.container.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
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
      location: true,
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
          user: {
            email: user.email,
          },
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
              user: {
                email: user.email,
              },
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
                  user: {
                    email: user.email,
                  },
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
                      user: {
                        email: user.email,
                      },
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
                          user: {
                            email: user.email,
                          },
                        },
                        include: {
                          containers: {
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
  });

  return Response.json({ container });
}
