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
        email: user.email,
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

  containers = containers.map((container) => {
    const [totalItems, totalContainers] = computeCounts(container, containers);
    return {
      ...container,
      itemCount: totalItems + container?._count?.items,
      containerCount: totalContainers + container?._count?.containers,
    };
  });

  return Response.json({ containers });
}
