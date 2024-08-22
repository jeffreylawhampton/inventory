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
          email: user.email,
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
        categories: true,
        container: true,
        images: true,
      },
    });
  } else {
    items = await prisma.item.findMany({
      where: {
        user: {
          email: user.email,
        },
        NOT: {
          [type]: {
            id: parseInt(filter),
          },
        },
      },
      include: {
        location: true,
        categories: true,
        container: true,
        images: true,
      },
    });
  }

  return Response.json({ items });
}
