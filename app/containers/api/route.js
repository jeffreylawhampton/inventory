import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { computeCounts } from "@/app/lib/helpers";

export async function GET(req) {
  const { user } = await getSession();
  const params = new URL(req.url).searchParams;
  const isFave = params.get("favorite") === "true";

  let containers = await prisma.container.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      user: {
        auth0Id: user.sub,
      },
      favorite: isFave ? true : undefined,
    },
    select: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      items: {
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          favorite: true,
          containerId: true,
          locationId: true,
          container: true,
          categories: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
      color: true,
      parentContainer: true,
      parentContainerId: true,
      name: true,
      id: true,
      favorite: true,
      location: true,
      locationId: true,
      userId: true,
    },
  });

  const withCounts = containers.map((con) => {
    const [itemCount, containerCount] = computeCounts(con, containers);
    return { ...con, itemCount, containerCount };
  });

  return Response.json(withCounts);
}
