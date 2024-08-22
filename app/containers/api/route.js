import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
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
      parentContainer: {
        include: {
          parentContainer: {
            include: {
              parentContainer: true,
            },
          },
        },
      },
      items: true,
      containers: {
        include: {
          items: true,
          containers: {
            include: {
              items: true,
              containers: {
                include: {
                  items: true,
                  containers: {
                    include: {
                      items: true,
                      containers: {
                        include: {
                          items: true,
                          containers: true,
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
