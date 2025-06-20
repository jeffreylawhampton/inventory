import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  id = parseInt(id);
  const category = await prisma.category.findFirst({
    where: {
      id,
      user: {
        auth0Id: user.sub,
      },
    },
    select: {
      items: {
        include: {
          images: true,
          location: true,
          container: true,
          categories: {
            include: {
              color: true,
            },
          },
        },
      },
      name: true,
      id: true,
      color: true,
      userId: true,
      favorite: true,
      icon: true,
    },
  });
  return Response.json(category);
}
