import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(req) {
  const { user } = await getSession();

  const categories = await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      name: true,
      createdAt: true,
      id: true,
      color: true,
      items: {
        select: {
          name: true,
          id: true,
          images: true,
          location: {
            select: {
              name: true,
              id: true,
            },
          },
          container: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return Response.json({ categories });
}
