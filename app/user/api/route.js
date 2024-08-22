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
      locations: {
        orderBy: {
          name: "asc",
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
      categories: {
        orderBy: {
          name: "asc",
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
