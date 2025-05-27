import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { buildParentContainerSelect, getDescendants } from "@/app/lib/helpers";
import { computeCounts } from "@/app/lib/helpers";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;

  id = parseInt(id);

  let container = await prisma.container.findFirst({
    orderBy: {
      name: "asc",
    },
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
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
      user: { email: user.email },
    },
    include: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      items: {
        include: {
          categories: { include: { color: true } },
          location: true,
          container: true,
          images: true,
        },
      },
      location: true,
      parentContainer: true,
      color: true,
    },
  });

  const descendants = getDescendants(allContainers, id);

  descendants.forEach((descendant) => {
    const [totalItems, totalContainers] = computeCounts(
      descendant,
      allContainers
    );
    descendant.containerCount = descendant._count.containers + totalContainers;
    descendant.itemCount = descendant._count.items + totalItems;
  });

  container = { ...container, containers: descendants };

  return Response.json({ container });
}
