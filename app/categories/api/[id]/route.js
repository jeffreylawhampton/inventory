import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { buildParentContainerSelect } from "@/app/lib/helpers";

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
        orderBy: {
          name: "asc",
        },
        include: {
          images: true,
          location: true,
          container: {
            select: buildParentContainerSelect(10),
          },
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
