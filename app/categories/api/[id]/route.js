import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  id = parseInt(id);
  const category = await prisma.category.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    select: {
      items: {
        select: {
          name: true,
          images: true,
          id: true,
          location: true,
          container: true,
          categories: true,
        },
      },
      name: true,
      id: true,
      color: true,
    },
  });
  return Response.json({ category });
}
