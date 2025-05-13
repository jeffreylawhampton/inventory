import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(req) {
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
        where: {
          containerId: null,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          id: true,
          locationId: true,
          favorite: true,
          location: {
            select: {
              name: true,
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
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
          items: {
            orderBy: {
              name: "asc",
            },
            select: {
              name: true,
              id: true,
              locationId: true,
              location: true,
              container: true,
              containerId: true,
            },
          },
          parentContainer: true,
          location: true,
          color: true,
        },
      },
    },
  });

  return Response.json({ locations });
}
