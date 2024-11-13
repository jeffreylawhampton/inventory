import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(req) {
  const { user } = await getSession();
  const params = new URL(req.url).searchParams;
  const isFave = params.get("favorite") === "true";

  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
      favorite: isFave ? true : undefined,
    },
    select: {
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
