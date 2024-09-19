import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const categories = await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      id: true,
      name: true,
      color: {
        select: {
          hex: true,
        },
      },
      userId: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });
  return Response.json({ categories });
}
