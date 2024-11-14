import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { sortObjectArray } from "@/app/lib/helpers";

export async function GET(req) {
  const { user } = await getSession();
  const params = new URL(req.url).searchParams;
  const isFave = params.get("favorite") === "true";

  let categories = await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
      favorite: isFave ? true : undefined,
    },
    select: {
      _count: {
        select: {
          items: true,
        },
      },
      name: true,
      createdAt: true,
      id: true,
      color: true,
      favorite: true,
      items: {
        select: {
          name: true,
          id: true,
          images: true,
          location: {
            select: {
              name: true,
              id: true,
            },
          },
          container: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        take: 5,
      },
    },
  });

  categories = sortObjectArray(categories);

  return Response.json({ categories });
}
