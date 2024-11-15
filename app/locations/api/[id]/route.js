import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  id = parseInt(id);
  const { user } = await getSession();

  const location = await prisma.location.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
        where: {
          user: {
            email: user.email,
          },
          containerId: null,
        },
        include: {
          images: true,
          categories: {
            include: {
              color: true,
            },
          },
          container: true,
        },
      },
      containers: {
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
              containers: {
                include: {
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
              items: true,
            },
          },
          color: true,
          items: {
            where: {
              user: {
                email: user.email,
              },
            },
            include: {
              container: true,
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
  });

  return Response.json({ location });
}
