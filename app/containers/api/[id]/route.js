import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import {
  buildParentContainerSelect,
  getDescendants,
  computeCounts,
} from "@/app/lib/helpers";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);

  let container = await prisma.container.findFirst({
    orderBy: {
      name: "asc",
    },
    where: {
      id,
      user: {
        auth0Id: user.sub,
      },
    },
    include: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      color: true,
      parentContainer: {
        select: buildParentContainerSelect(10),
      },
      location: true,
      items: {
        where: {
          containerId: id,
        },
        include: {
          location: true,
          container: {
            select: {
              id: true,
              name: true,
              color: true,
              parentContainer: { select: buildParentContainerSelect(10) },
            },
          },
          categories: {
            orderBy: { name: "asc" },
            select: { id: true, name: true, color: true },
          },
        },
      },
    },
  });

  const allContainers = await prisma.container.findMany({
    where: {
      user: { auth0Id: user.sub },
      id: {
        not: id,
      },
    },
    select: {
      id: true,
      name: true,
      parentContainer: { select: buildParentContainerSelect(10) },
      location: true,
      parentContainerId: true,
      icon: true,
      locationId: true,
      favorite: true,
      color: true,
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      items: {
        select: {
          id: true,
          name: true,
          icon: true,
          containerId: true,
          locationId: true,
          categories: {
            orderBy: { name: "asc" },
            select: { id: true, name: true, color: true },
          },
          location: true,
          container: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          favorite: true,
        },
      },
    },
  });

  const descendants = getDescendants(allContainers, container.id);

  const withCounts = descendants.map((descendant) => {
    const [itemCount, containerCount] = computeCounts(
      descendant,
      allContainers
    );

    return { ...descendant, itemCount, containerCount };
  });

  container = {
    ...container,
    containers: withCounts,
  };

  return Response.json(container);
}
