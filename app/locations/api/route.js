import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(req) {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      items: {
        where: {
          containerId: null,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          id: true,
          locationId: true,
          favorite: true,
          containerId: true,
          location: {
            select: {
              name: true,
              id: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
              color: {
                select: {
                  id: true,
                  hex: true,
                },
              },
            },
          },
        },
      },
      containers: {
        orderBy: {
          name: "asc",
        },
        where: {
          user: {
            email: user.email,
          },
        },
        include: {
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
              name: true,
              id: true,
              locationId: true,
              location: {
                select: {
                  id: true,
                  name: true,
                },
              },
              container: {
                select: {
                  id: true,
                  name: true,
                  parentContainerId: true,
                },
              },
              containerId: true,
              favorite: true,
            },
          },
          parentContainer: true,
          location: true,
          color: true,
        },
      },
    },
  });

  const items = await prisma.item.findMany({
    where: {
      user: {
        email: user.email,
      },
      locationId: null,
      containerId: null,
    },
    select: {
      id: true,
      name: true,
      container: true,
      containerId: true,
      locationId: true,
      favorite: true,
      categories: {
        select: {
          id: true,
          name: true,
          color: {
            select: {
              hex: true,
            },
          },
        },
      },
    },
  });

  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
      locationId: null,
    },
    select: {
      id: true,
      name: true,
      color: true,
      parentContainerId: true,
      locationId: true,
      favorite: true,
      items: {
        select: {
          id: true,
          name: true,
          containerId: true,
          locationId: true,
          favorite: true,
          categories: {
            select: {
              id: true,
              name: true,
              color: {
                select: {
                  id: true,
                  hex: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const itemCount = await prisma.item.count({
    where: {
      user: {
        email: user.email,
      },
      locationId: null,
    },
  });

  locations.push({
    name: "No location",
    id: null,
    items,
    containers,
    _count: { items: itemCount, containers: containers?.length },
  });

  // 1. Collect all containers from all locations
  let allFetchedContainers = locations.flatMap((loc) => loc.containers);

  // You will also push top-level no-location containers here later

  // 2. Build lookup maps
  const containerMap = new Map(); // parentContainerId -> [containers]
  const containerById = new Map();

  for (const container of allFetchedContainers) {
    containerById.set(container.id, container);
    const parentId = container.parentContainerId;
    if (!containerMap.has(parentId)) {
      containerMap.set(parentId, []);
    }
    containerMap.get(parentId).push(container);
  }

  // 3. Count descendants
  const countDescendants = (container) => {
    let containerCount = container._count?.containers || 0;
    let itemCount = container._count?.items + 50 || 0;

    const children = containerMap.get(container.id) || [];
    for (const child of children) {
      const { containerCount: cc, itemCount: ic } = countDescendants(child);
      containerCount += cc;
      itemCount += ic;
    }

    return { containerCount, itemCount };
  };

  const containerCounts = allFetchedContainers.map((c) => {
    const { containerCount, itemCount } = countDescendants(
      containerById.get(c.id)
    );
    return { id: c.id, containerCount, itemCount };
  });

  // 4. Enrich containers inside each location
  for (const location of locations) {
    location.containers = location.containers.map((c) => {
      const counts = countDescendants(containerById.get(c.id));
      return {
        ...c,
        descendantContainerCount: counts.containerCount,
        descendantItemCount: counts.itemCount,
      };
    });
  }

  return Response.json({ locations, containerCounts });
}
