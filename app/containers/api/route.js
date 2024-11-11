import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { orderBy } from "lodash";

export async function GET() {
  const { user } = await getSession();

  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
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
      items: {
        orderBy: {
          name: "asc",
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
      parentContainer: {
        include: {
          parentContainer: true,
        },
      },
      parentContainerId: true,
      name: true,
      id: true,
      favorite: true,
      location: true,
      locationId: true,
      userId: true,
    },
  });
  return Response.json({ containers });
}
