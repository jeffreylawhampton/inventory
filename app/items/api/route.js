import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, other) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  const searchString = params.get("search");
  const favorite = params.get("favorite");

  const isFave = !!favorite;

  const items = await prisma.item.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      user: {
        auth0Id: user.sub,
      },
      favorite: isFave ? true : undefined,
      OR: [
        {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        { description: { contains: searchString, mode: "insensitive" } },
        { purchasedAt: { contains: searchString, mode: "insensitive" } },
      ],
    },
    include: {
      location: true,
      categories: {
        orderBy: {
          name: "asc",
        },
        include: { color: true },
      },
      container: true,
      images: true,
    },
  });

  return Response.json({ items });
}
