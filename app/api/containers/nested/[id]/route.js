import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);
  const containers = await prisma.container.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      location: true,
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
          items: {
            include: {
              categories: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          color: true,
          containers: {
            include: {
              items: {
                include: {
                  categories: {
                    select: {
                      id: true,
                      name: true,
                      color: true,
                    },
                  },
                },
              },
              color: true,
              containers: {
                include: {
                  items: {
                    include: {
                      categories: {
                        select: {
                          id: true,
                          name: true,
                          color: true,
                        },
                      },
                    },
                  },
                  color: true,
                  containers: {
                    include: {
                      items: {
                        include: {
                          categories: {
                            select: {
                              id: true,
                              name: true,
                              color: true,
                            },
                          },
                        },
                      },
                      color: true,
                      containers: {
                        include: {
                          items: {
                            include: {
                              categories: {
                                select: {
                                  id: true,
                                  name: true,
                                  color: true,
                                },
                              },
                            },
                          },
                          color: true,
                          containers: {
                            include: {
                              items: {
                                include: {
                                  categories: {
                                    select: {
                                      id: true,
                                      name: true,
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
    },
  });
  return Response.json({ containers });
}
