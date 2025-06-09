import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(req) {
  const {
    user: { sub },
  } = await getSession();

  const params = new URL(req.url).searchParams;
  const active = params.get("active");

  const user = await prisma.user.findUnique({
    where: {
      auth0Id: sub,
    },
    include: {
      colors: true,
      locations: {
        orderBy: {
          createdAt: "asc",
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
        select: {
          id: true,
          name: true,
          favorite: true,
          parentContainerId: true,
          locationId: true,
          parentContainer: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
          color: {
            select: {
              hex: true,
            },
          },
        },
      },
      categories: {
        orderBy: {
          name: "asc",
        },
        include: {
          color: {
            select: {
              hex: true,
            },
          },
        },
      },
      items: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  return Response.json(user);
}
