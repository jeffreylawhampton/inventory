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
    include: {
      items: true,
    },
  });
  return Response.json({ category });
}
