import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  const searchString = params.get("query");

  const results = await prisma.user.findUnique({
    where: {
      auth0Id: user.sub,
    },
    select: {
      items: {
        where: {
          OR: [
            {
              name: {
                contains: searchString,
                mode: "insensitive",
              },
            },
            { description: { contains: searchString, mode: "insensitive" } },
            { purchasedAt: { contains: searchString, mode: "insensitive" } },
          ],
        },
        select: {
          categories: {
            include: {
              color: true,
            },
          },
          location: true,
          container: true,
          favorite: true,
          id: true,
          name: true,
        },
      },
      containers: {
        where: {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        select: {
          color: true,
          id: true,
          name: true,
          favorite: true,
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
        },
      },
      categories: {
        where: {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        select: {
          color: true,
          name: true,
          id: true,
          favorite: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
      locations: {
        where: {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        select: {
          name: true,
          id: true,
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
        },
      },
    },
  });

  return Response.json({ results });
}
