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
        select: buildParentContainerSelect(20),
      },
      location: true,
      items: {
        include: {
          location: true,
          categories: {
            include: {
              color: true,
            },
          },
        },
      },
    },
  });

  const allContainers = await prisma.container.findMany({
    where: {
      user: { auth0Id: user.sub },
    },
    select: {
      id: true,
      name: true,
      parentContainer: true,
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
          categories: { select: { id: true, name: true, color: true } },
          location: true,
          container: true,
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
  container = { ...container, containers: withCounts };
  return Response.json(container);
}
