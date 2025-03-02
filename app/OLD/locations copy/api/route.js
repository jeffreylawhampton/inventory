import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { sortObjectArray } from "@/app/lib/helpers";

export async function GET() {
  const { user } = await getSession();

  let locations = await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
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

  if (locations?.length) locations = sortObjectArray(locations);
  return Response.json({ locations });
}
