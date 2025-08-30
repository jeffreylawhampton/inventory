import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { buildParentContainerSelect, computeCounts } from "@/app/lib/helpers";

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
          icon: true,
          categories: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
        },
      },
      color: true,
      parentContainer: {
        select: buildParentContainerSelect(8),
      },
      parentContainerId: true,
      name: true,
      id: true,
      favorite: true,
      location: true,
      locationId: true,
      userId: true,
      icon: true,
    },
  });

  const withCounts = containers.map((con) => {
    const [itemCount, containerCount] = computeCounts(con, containers);
    return {
      ...con,
      type: "container",
      itemCount,
      containerCount,
      items: con?.items?.map((i) => {
        return { ...i, type: "item" };
      }),
    };
  });

  return Response.json(withCounts);
}
