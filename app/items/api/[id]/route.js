import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { buildParentContainerSelect } from "@/app/lib/helpers";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  id = parseInt(id);
  const item = await prisma.item.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      categories: {
        orderBy: {
          name: "asc",
        },
        include: {
          color: true,
        },
      },
      images: true,
      location: true,
      container: {
        select: {
          name: true,
          id: true,
          color: {
            select: {
              hex: true,
            },
          },
          parentContainer: {
            select: buildParentContainerSelect(20),
          },
        },
      },
    },
  });
  return Response.json({ item });
}
