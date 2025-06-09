import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const filter = params.get("filter");

  let items;

  if (type === "category") {
    items = await prisma.item.findMany({
      where: {
        user: {
          auth0Id: user.sub,
        },
        NOT: {
          categories: {
            some: {
              id: parseInt(filter),
            },
          },
        },
      },
      include: {
        location: true,
        categories: {
          include: {
            color: true,
          },
        },
        container: {
          include: {
            color: true,
          },
        },
        images: true,
      },
    });
  } else {
    items = await prisma.item.findMany({
      where: {
        user: {
          auth0Id: user.sub,
        },
        NOT: {
          [type]: {
            id: parseInt(filter),
          },
        },
      },
      include: {
        location: true,
        categories: {
          include: {
            color: true,
          },
        },
        container: {
          include: {
            color: true,
          },
        },
        images: true,
      },
    });
  }

  return Response.json({ items });
}
