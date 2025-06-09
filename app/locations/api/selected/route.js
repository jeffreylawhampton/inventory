import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import {
  buildParentContainerSelect,
  getContainerCounts,
} from "@/app/lib/helpers";

export async function GET(req) {
  try {
    const { user } = await getSession();
    const params = new URL(req.url).searchParams;
    const unparsedId = params.get("id");
    const id = unparsedId == "null" ? null : parseInt(unparsedId);
    const type = params.get("type");

    let selected = {};

    if (type === "location") {
      if (id == null) {
        const containers = await prisma.container.findMany({
          where: {
            user: {
              auth0Id: user.sub,
            },
            locationId: null,
            parentContainerId: null,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            parentContainerId: true,
            color: true,
            locationId: true,
            favorite: true,
            _count: {
              select: {
                items: true,
                containers: true,
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
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            categories: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
            images: true,
            containerId: true,
            locationId: true,
            container: true,
            favorite: true,
          },
        });
        selected = { id: null, name: "No location", containers, items };
      } else {
        selected = await prisma.location.findUnique({
          where: {
            user: {
              auth0Id: user.sub,
            },
            id,
          },
          select: {
            name: true,
            id: true,
            favorite: true,
            userId: true,
            items: {
              where: {
                containerId: null,
              },
              orderBy: {
                name: "asc",
              },
              select: {
                id: true,
                name: true,
                categories: {
                  include: {
                    color: true,
                  },
                },
                images: true,
                favorite: true,
              },
            },
            containers: {
              where: {
                parentContainerId: null,
              },
              orderBy: {
                name: "asc",
              },
              select: {
                id: true,
                name: true,
                favorite: true,
                color: true,
                location: true,
                locationId: true,
                parentContainerId: true,
                _count: {
                  select: {
                    items: true,
                    containers: true,
                  },
                },
              },
            },
          },
        });
      }
    }

    if (type === "item") {
      selected = await prisma.item.findUnique({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id,
        },
        include: {
          container: {
            select: {
              id: true,
              name: true,
              color: true,
              parentContainer: {
                select: buildParentContainerSelect(20),
              },
            },
          },
          categories: {
            orderBy: {
              name: "asc",
            },
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
          images: true,
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }
    if (type === "container") {
      selected = await prisma.container.findUnique({
        where: {
          user: {
            auth0Id: user.sub,
          },
          id,
        },
        select: {
          id: true,
          name: true,
          color: true,
          userId: true,
          parentContainer: {
            select: buildParentContainerSelect(20),
          },
          parentContainerId: true,
          location: true,
          locationId: true,
          favorite: true,
          items: {
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              favorite: true,
              container: {
                select: {
                  id: true,
                  name: true,
                },
              },
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
          },
          containers: {
            select: {
              _count: {
                select: {
                  items: true,
                  containers: true,
                },
              },
              name: true,
              id: true,
              color: true,
              favorite: true,
              parentContainer: true,
              location: true,
            },
          },
        },
      });
    }

    if (type != "item") {
      const topLevelIds = selected?.containers?.map((c) => c.id);
      const countsById = await getContainerCounts(topLevelIds);

      selected.containers = selected?.containers?.map((c) => ({
        ...c,
        ...countsById[c.id],
      }));
    }

    selected.type = type;
    return Response.json(selected);
  } catch (e) {
    console.error("GET /locations/api/selected error", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
