import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);
  const { categories } = await prisma.item.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    select: {
      categories: true,
    },
  });
  return Response.json({ categories });
}
