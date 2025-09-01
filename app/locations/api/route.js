import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

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

  let allContainers = Array.from(
    new Map(
      (locations || []).flatMap((l) => l.containers || []).map((c) => [c.id, c])
    ).values()
  );

  const directItemsByContainer = new Map();
  for (const c of allContainers) {
    directItemsByContainer.set(c.id, (c.items && c.items.length) || 0);
  }

  const childrenByParent = new Map();
  for (const c of allContainers) {
    if (c.parentContainerId != null) {
      const arr = childrenByParent.get(c.parentContainerId) || [];
      arr.push(c.id);
      childrenByParent.set(c.parentContainerId, arr);
    }
  }

  const memo = new Map();
  function dfs(id) {
    if (memo.has(id)) return memo.get(id);
    const kids = childrenByParent.get(id) || [];
    let itemCount = directItemsByContainer.get(id) || 0;
    let containerCount = kids.length;
    for (const kid of kids) {
      const res = dfs(kid);
      itemCount += res[0];
      containerCount += res[1];
    }
    const out = [itemCount, containerCount];
    memo.set(id, out);
    return out;
  }

  const containerCounts = allContainers.map((c) => {
    const res = dfs(c.id);
    return { id: c.id, itemCount: res[0], containerCount: res[1] };
  });

  return Response.json({ locations, containerCounts });
}
