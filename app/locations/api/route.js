import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { computeCounts } from "@/app/lib/helpers";

export async function GET(req) {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    where: {
      user: {
        auth0Id: user.sub,
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
          icon: true,
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
              icon: true,
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
          items: {
            orderBy: {
              name: "asc",
            },
            select: {
              name: true,
              id: true,
              locationId: true,
              icon: true,
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
        auth0Id: user.sub,
      },
      locationId: null,
      containerId: null,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      container: true,
      icon: true,
      containerId: true,
      locationId: true,
      favorite: true,
      categories: {
        select: {
          id: true,
          name: true,
          icon: true,
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
        auth0Id: user.sub,
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
      icon: true,
      items: {
        select: {
          id: true,
          name: true,
          containerId: true,
          locationId: true,
          favorite: true,
          icon: true,
          categories: {
            select: {
              id: true,
              name: true,
              icon: true,
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
        auth0Id: user.sub,
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

  let allFetchedContainers = locations.flatMap((loc) => loc.containers);

  const containerCounts = allFetchedContainers.map((con) => {
    const [itemCount, containerCount] = computeCounts(
      con,
      allFetchedContainers
    );
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

  for (const location of locations) {
    location.containers = location.containers.map((c) => {
      return containerCounts?.find((container) => container.id === c.id);
    });
  }

  return Response.json({ locations, containerCounts });
}
