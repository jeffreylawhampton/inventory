import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
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
      items: {
        where: {
          containerId: null,
          user: {
            email: user.email,
          },
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
          user: {
            email: user.email,
          },
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
              user: {
                email: user.email,
              },
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
                  user: {
                    email: user.email,
                  },
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
                      user: {
                        email: user.email,
                      },
                    },
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
                        where: {
                          user: {
                            email: user.email,
                          },
                        },
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
                            where: {
                              user: {
                                email: user.email,
                              },
                            },
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
                                    where: {
                                      user: {
                                        email: user.email,
                                      },
                                    },
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
