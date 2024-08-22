import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  // const take = parseInt(params.get("take"));

  id = parseInt(id);
  const container = await prisma.container.findFirst({
    where: {
      id,
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
      parentContainer: {
        include: {
          parentContainer: {
            include: {
              parentContainer: true,
            },
          },
        },
      },
      location: true,
      items: {
        include: {
          images: true,
          categories: true,
          location: true,
        },
      },
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
                          containers: true,
                          items: true,
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

  return Response.json({ container });
}
