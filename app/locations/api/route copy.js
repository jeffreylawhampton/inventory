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
          favorite: true,
          location: {
            select: {
              name: true,
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
              location: true,
              container: true,
              containerId: true,
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
    select: {
      id: true,
      name: true,
      container: true,
      containerId: true,
      locationId: true,
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
      items: {
        select: {
          id: true,
          name: true,
          containerId: true,
          locationId: true,
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

  return Response.json({ locations });
}
