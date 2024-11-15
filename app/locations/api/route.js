import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    orderBy: {
      name: "asc",
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
          categories: {
            include: {
              color: true,
            },
          },
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
          parentContainer: true,
          location: true,
          color: true,
          items: {
            where: {
              user: {
                email: user.email,
              },
            },
            include: {
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

  return Response.json({ locations });
}
