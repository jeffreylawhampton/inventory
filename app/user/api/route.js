import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { orderBy } from "lodash";

export async function GET() {
  const {
    user: { email },
  } = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      colors: true,
      locations: {
        where: {
          user: {
            email,
          },
        },
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              containers: {
                where: {
                  user: {
                    email,
                  },
                },
              },
            },
          },
        },
      },
      containers: {
        where: {
          user: {
            email,
          },
        },
        include: {
          containers: {
            where: {
              user: {
                email,
              },
            },
            include: {
              containers: {
                where: {
                  user: {
                    email,
                  },
                },
                include: {
                  containers: {
                    where: {
                      user: {
                        email,
                      },
                    },
                    include: {
                      containers: {
                        where: {
                          user: {
                            email,
                          },
                        },
                        include: {
                          containers: {
                            where: {
                              user: {
                                email,
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
        include: {
          color: true,
        },
      },
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return Response.json(user);
}
