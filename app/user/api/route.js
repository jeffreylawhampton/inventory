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
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              containers: true,
            },
          },
        },
      },
      containers: {
        include: {
          containers: {
            include: {
              containers: {
                include: {
                  containers: {
                    include: {
                      containers: {
                        include: {
                          containers: {},
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
